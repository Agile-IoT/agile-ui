import React, {Component} from 'react';
import {Form} from '../components';
import {connect} from 'react-redux';
import {fetchLocks, fetchEntityLocks, setLock, formSelected} from '../actions';

class AddLock extends Component {

  componentDidMount() {
    this.props.formSelected([]);
    this.props.fetchLocks();
    this.props.fetchEntityLocks(this.props.params.id, this.props.params.type);
  }

  addLock(locks) {
    let newLocks = this.props.policies[this.props.params.field].flows.map(block => {
      return block;
    });
    newLocks.push({op: this.props.params.op, locks: locks});
    this.props.setLock({
      entityId: this.props.params.id,
      entityType: this.props.params.type,
      field: this.props.params.field,
      policy: newLocks
    })
  }

  renderOptions(options) {
    let optionFields = [(<option value='empty' key='emptyOption'/>)]; // Empty field
    for (var key in options) {
      if (options.hasOwnProperty(key)) { //&& this.props.form.find(val => {return key === val}) === undefined to avoid duplicates
        optionFields.push((
          <option key={key} value={key}>{options[key].name ? options[key].name : key}</option>
        ))
      }
    }
    return optionFields;
  }

  renderForm() {
    return (
      <Form
        formNames={this.props.form}
        deleteFormName={this.props.formSelected}
        forms={this.props.lockFormats}
        submitText={'Submit'}
        onSubmit={event => {
          //Iterate over all new locks added in the UI and prepare it for the format in IDM
          let i = 0;
          let locks = [];
          while(event.target[i]) {
            const lockInfo = event.target[i].name.split('_');
            const lockNumber = lockInfo[0];
            const lockType = lockInfo[1];
            const lockProperty = lockInfo[2];
            if(lockNumber && lockNumber !== '') {
              locks[lockNumber] = locks[lockNumber] ? locks[lockNumber] : {lock: lockType};
              if(event.target[i].value && lockProperty) {
                if(locks[lockNumber].args) {
                  locks[lockNumber].args.push(event.target[i].value);
                } else {
                  locks[lockNumber].args = [event.target[i].value];
                }
              }
            }
            ++i;
          }
          this.addLock(locks);
          this.props.formSelected([]);
        }}
      />)
  }

  renderSelectField() {
    const options = this.renderOptions(this.props.lockFormats);
    if (options.length > 1) {
      return (<select value={'empty'} onChange={event => {
        if (event.target.value !== 'empty') {
          this.props.formSelected(this.props.form.concat(event.target.value));
        }
      }}>
        {options}
      </select>)
    }
    ;
  }

  render() {
    return (
      <div>
        {this.renderForm(this.props.form)}
        {this.renderSelectField()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lockFormats: state.lockFormats,
    policies: state.policies,
    form: state.form
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocks: () => dispatch(fetchLocks()),
    setLock: (params) => dispatch(setLock(params)),
    fetchEntityLocks: (entity_id, entity_type) => dispatch(fetchEntityLocks(entity_id, entity_type)),
    formSelected: (formName) => dispatch(formSelected(formName))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddLock);
