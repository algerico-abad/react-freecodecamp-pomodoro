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
            time_left: 1500,
            time_session: 25,
            time_break: 5,
            time_count: false,
            time_phase: 'Session',
            time_ID: null
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
                time_session: Math.max(1, state.time_session - 1),
            }))
            this.setState((state) => ({
                time_left: (state.time_phase === 'Session') ? state.time_session * 60 : state.time_break * 60
            }))
        }
    }

    IncrementSession() {
        if (!this.state.time_count) {
            this.setState((state) => ({
                time_session: Math.min(60, state.time_session + 1),
            }))
            this.setState((state) => ({
                time_left: (state.time_phase === 'Session') ? state.time_session * 60 : state.time_break * 60
            }))
        }
    }

    DecrementBreak() {
        if (!this.state.time_count) {
            this.setState((state) => ({
                time_break: Math.max(1, state.time_break - 1),
            }))
            this.setState((state) => ({
                time_left: (state.time_phase === 'Session') ? state.time_session * 60 : state.time_break * 60
            }))
        }
    }

    IncrementBreak() {
        if (!this.state.time_count) {
            this.setState((state) => ({
                time_break: Math.min(60, state.time_break + 1),
            }))
            this.setState((state) => ({
                time_left: (state.time_phase === 'Session') ? state.time_session * 60 : state.time_break * 60
            }))
        }
    }

    ResetClock() {
        if (this.state.time_ID != null) this.state.time_ID.cancel()
        this.setState((state) => ({
            label_start: 'Start',
            label_timer: 'Session',
            time_left: 1500,
            time_session: 25,
            time_break: 5,
            time_count: false,
            time_phase: 'Session',
            time_ID: null
        }))
        const AUDIO = document.getElementById('beep')
        AUDIO.pause()
        AUDIO.currentTime = 0
    }

    StartClock() {
        this.setState((state) => ({
            time_count: !state.time_count,
        }))
        this.setState((state) => ({
            label_start: (state.time_count) ? 'Pause' : 'Start',
            time_ID: (state.time_ID) ? state.time_ID.cancel() : this.Countdown(1000)
        }))
    }
    
    Countdown(timeout) {
        let countdown, cancel, nextStart
        nextStart = new Date().getTime() + timeout
        countdown = setInterval(() => {
            if (this.state.time_left > 0) {
                this.setState((state) => ({
                    time_left: state.time_left - 1
                }))
            } else {
                this.setState((state) => ({
                    label_timer: (state.label_timer === 'Session') ? 'Break' : 'Session',
                    time_phase: (state.time_phase === 'Session') ? 'Break' : 'Session',
                }))
                this.setState((state) => ({
                    time_left: (state.time_phase === 'Session') ? state.time_session * 60 : state.time_break * 60
                }))
                const AUDIO = document.getElementById('beep')
                AUDIO.play()
            }
            nextStart = new Date().getTime() + timeout
        }, nextStart - new Date().getTime())
        cancel = () => { clearInterval(countdown) }
        return { cancel: cancel }
    }

    CountdownDisplay() {
        if (this.state.time_left === 0) {
            return '00:00'
        } else {
            let MINUTES = Math.floor(this.state.time_left / 60)
            let SECONDS = this.state.time_left - MINUTES * 60
            return `${MINUTES.toString().padStart(2,0)}:${SECONDS.toString().padStart(2,0)}`
        }
    }

    render() {
        return (
            <div className='column' id='interface-main'>
                <audio id='beep'>
                    <source src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'/>
                </audio>
                <div className='column container' id='interface-clock'>
                    <div className='column' id='clock-timer'>
                        <div id='time-left'>{this.CountdownDisplay()}</div>
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