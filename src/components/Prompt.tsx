import React, { Component } from 'react'

export default class Prompt extends Component<{}
    ,
    {
        showPrompt: boolean,
        promptMessage: String
    }> {
    constructor(props) {
        super(props);
        this.state = {
            showPrompt: false,
            promptMessage: ""
        }
    }
    render() {
        return (
            <div className='prompt' hidden={!this.props.prompt.showPrompt}>{this.props.prompt.promptMessage}</div>
        )
    }
}
