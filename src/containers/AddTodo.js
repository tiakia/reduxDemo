import React ,{ Component, PropTypes } from 'react';
 
export default class AddTodo extends Component {
    handleClick(e){
        const node = this.refs.input;
        const text = node.value.trim();
        this.props.onAddClick(text);
      node.value = '';
    }
    render(){
       return(
           <div className="addTodo">
               <input type='text' ref='input' />
               <button onClick={ (e)=> this.handleClick(e)} className="addButton">
                   Add
               </button>
           </div>
       );
    }
}
AddTodo.propTypes = {
    onAddClick: PropTypes.func.isRequired
};
