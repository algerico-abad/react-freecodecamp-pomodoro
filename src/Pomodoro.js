import React from 'react'
import './Pomodoro.css'
import {ReactComponent as ICON_PLUS} from './assets/icons/plus-lg.svg'
import {ReactComponent as ICON_MINUS} from './assets/icons/dash-lg.svg'

class Pomodoro extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label_reset: 'Reset',
            label_start: 'Start',
            label_timer: 'Session',
            label_session: 'Session Time (Mins)',
            label_break: 'Break Time (Mins)',
            time_current_time: '25:00',
            time_current_seconds: 0,
            time_current_minutes: 25,
            time_session: 25,
            time_break: 5,
            time_count: false,
            time_phase: 'Session'
        }
        this.DecrementSession = this.DecrementSession.bind(this)
        this.IncrementSession = this.IncrementSession.bind(this)
        this.DecrementBreak = this.DecrementBreak.bind(this)
        this.IncrementBreak = this.IncrementBreak.bind(this)
        this.ResetClock = this.ResetClock.bind(this)
        this.StartClock = this.StartClock.bind(this)
    }

    DecrementSession() {
        if (!this.state.time_count) {
            this.setState((state) => ({
                time_session: (state.time_session > 1) ? state.time_session - 1 : 1
            }))
            this.setState((state) => ({
                time_current_time: `${(state.time_phase === 'Session') ? state.time_session.toString().padStart(2,0) : state.time_break.toString().padStart(2,0)}:00`,
                time_current_minutes: (state.time_phase === 'Session') ? state.time_session : state.time_break,
                time_current_seconds: 0
            }))
        }
    }

    IncrementSession() {
        if (!this.state.time_count) {
            this.setState((state) => ({
                time_session: (state.time_session < 60) ? state.time_session + 1 : 60
            }))
            this.setState((state) => ({
                time_current_time: `${(state.time_phase === 'Session') ? state.time_session.toString().padStart(2,0) : state.time_break.toString().padStart(2,0)}:00`,
                time_current_minutes: (state.time_phase === 'Session') ? state.time_session : state.time_break,
                time_current_seconds: 0
            }))
        }
    }

    DecrementBreak() {
        if (!this.state.time_count) {
            this.setState((state) => ({
                time_break: (state.time_break > 1) ? state.time_break - 1 : 1
            }))
            this.setState((state) => ({
                time_current_time: `${(state.time_phase === 'Session') ? state.time_session.toString().padStart(2,0) : state.time_break.toString().padStart(2,0)}:00`,
                time_current_minutes: (state.time_phase === 'Session') ? state.time_session : state.time_break,
                time_current_seconds: 0
            }))
        }
    }

    IncrementBreak() {
        if (!this.state.time_count) {
            this.setState((state) => ({
                time_break: (state.time_break < 60) ? state.time_break + 1 : 60
            }))
            this.setState((state) => ({
                time_current_time: `${(state.time_phase === 'Session') ? state.time_session.toString().padStart(2,0) : state.time_break.toString().padStart(2,0)}:00`,
                time_current_minutes: (state.time_phase === 'Session') ? state.time_session : state.time_break,
                time_current_seconds: 0
            }))
        }
    }

    ResetClock() {
        this.setState({
            label_timer: 'Session',
            time_current_time: '25:00',
            time_current_seconds: 0,
            time_current_minutes: 25,
            time_session: 25,
            time_break: 5,
            time_count: false,
            time_phase: 'Session'
        })
        const AUDIO = document.getElementById('beep')
        AUDIO.pause()
        AUDIO.currentTime = 0
    }

    StartClock() {
        this.setState((state) => ({
            time_count: !state.time_count,
        }))
        this.setState((state) => ({
            label_start: (state.time_count) ? 'Pause' : 'Start'
        }))
    }
    
    componentDidMount() {
        setInterval(() => {
            if (this.state.time_count) {
                this.setState({
                    time_current_time: `${this.state.time_current_minutes.toString().padStart(2, 0)}:${this.state.time_current_seconds.toString().padStart(2, 0)}`
                })
                console.log(this.state.time_current_seconds)
                if (this.state.time_current_seconds > 0) {
                    this.setState((state) => ({
                        time_current_seconds: state.time_current_seconds - 1
                    }))
                } else if (this.state.time_current_seconds == 0 && this.state.time_current_minutes > 0) {
                    this.setState((state) => ({
                        time_current_minutes: state.time_current_minutes - 1,
                        time_current_seconds: 59
                    }))
                } else if (this.state.time_current_seconds == 0 && this.state.time_current_minutes == 0) {
                    console.log('completed minutes...')
                    this.setState((state) => ({
                        label_timer: (state.label_timer === 'Session') ? 'Break' : 'Session',
                        time_phase: (state.time_phase === 'Session') ? 'Break' : 'Session',
                    }))
                    this.setState((state) => ({
                        time_current_minutes: (state.time_phase === 'Session') ? state.time_session : state.time_break
                    }))
                    const AUDIO = document.getElementById('beep')
                    AUDIO.play()
                }
            }
        }, 1000)
    }

    render() {
        return (
            <div className='column' id='interface-main'>
                <audio id='beep'>
                    <source src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'/>
                </audio>
                <div className='column container' id='interface-clock'>
                    <div className='column' id='clock-timer'>
                        <div id='time-left'>{this.state.time_current_time}</div>
                        <div id='timer-label' className='caption'>{this.state.label_timer}</div>
                    </div>
                    <div className='row' id='clock-actions'>
                        <div className='btn-text-sec' id='reset' onClick={this.ResetClock}>{this.state.label_reset}</div>
                        <div className='btn-text-pri' id='start_stop' onClick={this.StartClock}>{this.state.label_start}</div>
                    </div>
                </div>
                <div className='row container' id='interface-session'>
                    <div className='btn-icon-pri' id='session-decrement' onClick={this.DecrementSession}>
                        <ICON_MINUS />
                    </div>
                    <div className='column'>
                        <div id='session-length' className='label'>{this.state.time_session}</div>
                        <div id='session-label' className='caption'>{this.state.label_session}</div>
                    </div>
                    <div className='btn-icon-pri' id='session-increment' onClick={this.IncrementSession}>
                        <ICON_PLUS />
                    </div>
                </div>
                <div className='row container' id='interface-break'>
                    <div className='btn-icon-pri' id='break-decrement' onClick={this.DecrementBreak}>
                        <ICON_MINUS />
                    </div>
                    <div className='column'>
                        <div id='break-length' className='label'>{this.state.time_break}</div>
                        <div id='break-label' className='caption'>{this.state.label_break}</div>
                    </div>
                    <div className='btn-icon-pri' id='break-increment' onClick={this.IncrementBreak}>
                        <ICON_PLUS />
                    </div>
                </div>
            </div>
        )
    }
}

export default Pomodoro