import {Lexer} from './artemis-lexer'


class State{
    constructor(stateMachine){
        "use strict";
        this.stateMachine = stateMachine;
    }

    /**
     * This method handle the current token, and return the next state of the state machine
     * @param token
     */
    nextState(token, context){}

}

class MainState extends State{

    nextState(token, context){
        "use strict";
        switch (token.type){
            case 'Order':
                context.push({type:'elm-ordinal', value: token.value});
                return 'Main';
            case 'Size':
                context.push({type:'elm-size', value: token.value});
                return 'Main';
            case 'Color':
                context.push({type:'elm-color', value: token.value});
                return 'Main';
            case 'Target':
                context.push({type:'elm-type', value: token.value});
                return 'Main';
            case 'Position':
                context.push({type:'elm-position', value: token.value});
                return 'Main';
            case 'String':
                context.push({type:'free-text', value: token.value});
                return 'Main';
            case 'With':
                return 'With';
            case 'Relation':
                let cntx = {type: 'rel-location', value:token.value, target:[]};
                this.stateMachine.currentContext().push(cntx);
                this.stateMachine.pushCntx(cntx.target);
                return 'Main';
            default :
                throw new Error("Unexpected Token at this state: " + token);

        }
    }
}

class WithState extends State{
    nextState(token) {
        "use strict";
        if (token.type === 'WithEx') {
            let context = {type: 'elm-' + token.value};
            switch (token.value) {
                case 'class':
                case 'style':
                case 'identity':
                case 'tag':
                case 'text':
                    this.stateMachine.currentContext().push(context);
                    this.stateMachine.pushCntx(context);
                    return "Val";
                case 'attribute':
                    this.stateMachine.currentContext().push(context);
                    this.stateMachine.pushCntx(context);
                    return "Att";
            }
        }else {
            throw new Error("Unexpected Token at this state: " + token);
        }

    }
}

class AttState extends State{
    nextState(token) {
        "use strict";
        if (token.type === 'String') {
            this.stateMachine.currentContext()['name'] = token.value;
            return 'Val';
        } else {
            throw new Error("Unexpected Token at this state: " + token);
        }

    }
}

class ValState extends State{
    nextState(token) {
        "use strict";
        if (token.type === 'String') {
            this.stateMachine.currentContext()['value'] = token.value;
            this.stateMachine.popCntx();
            return 'Main'
        } else {
            throw new Error("Unexpected Token at this state: " + token);
        }
    }
}
/**
 * The state machine
 */
class StateMachine{
    constructor(){
        "use strict";
        this.root_context = [];
        this.context = [this.root_context];
        this.states = {
            'Main': new MainState(this),
            'With': new WithState(this),
            'Att': new AttState(this),
            'Val': new ValState(this)
        };

        this.currentState = this.states['Main'];
    }

    nextState(token){
        this.currentState =  this.states[this.currentState.nextState(token, this.currentContext())];
    }

    pushCntx(contex){
        "use strict";
        this.context.push(contex);
    }

    popCntx(){
        "use strict";
        this.context.pop();
    }

    currentContext(){
        "use strict";
        return this.context[this.context.length-1];
    }

    isValidExpression(){
        "use strict";
        return false;
    }
}

export class Parser {

    parse(text) {
        let lexer = new Lexer();
        var tokenStream = lexer.analyze(text);
        var stateMachine = new StateMachine();
        for (var token of tokenStream) {
            stateMachine.nextState(token, stateMachine.currentContext());
        }
        return stateMachine.root_context;
    }

    /**
     * register a method to listen for error in parsing
     * @param func
     */
    registerErrorListener(func){
        "use strict";

    }


}



