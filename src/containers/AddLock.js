/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License 2.0
 *which accompanies this distribution, and is available at
 *https://www.eclipse.org/legal/epl-2.0/
 *
 *SPDX-License-Identifier: EPL-2.0
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React, {Component} from 'react'
import {Form} from '../components'
import {connect} from 'react-redux'
import {fetchLocks, fetchEntityLocks, setLock, formSelected} from '../actions'

class AddLock extends Component {

  componentDidMount() {
    this.props.formSelected([])
    this.props.fetchLocks()
    this.props.fetchEntityLocks(this.props.params.id, this.props.params.type)
  }

  addLock(locks) {
    const {field, id, type, op} = this.props.params
    const newLocks = this.props.policies[field].flows.map(block => block)

    newLocks.push({op, locks})
    this.props.setLock({
      entityId: id,
      entityType: type,
      field: field,
      policy: newLocks
    })
  }

  renderOptions(options) {
    const optionFields = [(<option value='' key=''/>)]
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        optionFields.push((
          <option 
            key={key}
            value={key}
          >
            {options[key].name ? options[key].name : key} 
          </option>
        ))
      }
    }
    return optionFields
  }

  renderForm() {
    const {form, formSelected, lockFormats} = this.props
    return (
      <Form
        formNames={form}
        deleteFormName={formSelected}
        forms={lockFormats}
        submitText={'Submit'}
        onSubmit={e => {
          //Iterate over all new locks added in the UI and prepare it for the format in IDM
          let i = 0
          const locks = []

          while(e.target[i]) {
            const lockInfo = e.target[i].name.split('_')
            const lockNumber = lockInfo[0]
            const lockType = lockInfo[1]
            const lockProperty = lockInfo[2]
            if(lockNumber && lockNumber !== '') {
              locks[lockNumber] = locks[lockNumber]
                ? locks[lockNumber]
                : {lock: lockType}

              if(e.target[i].value && lockProperty) {
                if(locks[lockNumber].args) {
                  locks[lockNumber].args.push(e.target[i].value)
                } else {
                  locks[lockNumber].args = [e.target[i].value]
                }
              }
            }
            ++i
          }

          this.addLock(locks)
          formSelected([])
        }}
      />)
  }

  renderSelectField() {
    const options = this.renderOptions(this.props.lockFormats)
    if (options.length) {
      return (<select 
        value={''}
        onChange={e => {
          if (e.target.value !== '') {
            this.props.formSelected(this.props.form.concat(e.target.value))
          }
      }}>
        {options}
      </select>)
    }
  }

  render() {
    return (
      <div>
        {this.renderSelectField()}
        {this.renderForm(this.props.form)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lockFormats: state.lockFormats,
    policies: state.policies,
    form: state.form
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocks: () => dispatch(fetchLocks()),
    setLock: (params) => dispatch(setLock(params)),
    fetchEntityLocks: (entity_id, entity_type) =>
      dispatch(fetchEntityLocks(entity_id, entity_type)),
    formSelected: (formName) => dispatch(formSelected(formName))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddLock)
