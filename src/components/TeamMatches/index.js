import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    iplMatchesInfo: {},
  }

  componentDidMount() {
    this.getRecentMatches()
  }

  getFormattedObject = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getRecentMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    console.log(this.props)

    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const fetchedData = await response.json()

    console.log(fetchedData)

    const updatedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedObject(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(recentMatch =>
        this.getFormattedObject(recentMatch),
      ),
    }
    this.setState({iplMatchesInfo: updatedData, isLoading: false})
  }

  // GETTING CLASS NAME BASED ON EACH TEAM/ID

  getTeamClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  // LOADER

  renderLoader = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height="50" />
    </div>
  )

  // RENDERING TEAM BANNER URL & LATEST MATCH & MATCH CARD

  renderTeamMatches = () => {
    const {iplMatchesInfo} = this.state
    const {teamBannerURL, recentMatches, latestMatch} = iplMatchesInfo

    return (
      <div className="team-matches-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchDetails={latestMatch} />
        <ul className="recent-matches-list">
          {recentMatches.map(recentMatch => (
            <MatchCard matchData={recentMatch} key={recentMatch.id} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {isLoading} = this.state
    const className = `team-container ${this.getTeamClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
