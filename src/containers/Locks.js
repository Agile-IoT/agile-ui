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
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FloatingActionButton, FlatButton, SelectField, MenuItem} from 'material-ui'
import TextField from 'material-ui/TextField'
import ContentRemove from 'material-ui/svg-icons/content/remove'
import {fetchEntityLocks, fetchLocks, deleteLock, setLock, addLockField, removeLockField, formSelected} from '../actions'
import {LockItem, GenericListItem, Form} from '../components'
import ReactTooltip from 'react-tooltip'

const formSelectToolTip = 'You can select multiple lock types to add them as one block to this policy. They will be evaluated with a logical AND.'

const deleteButtonStyle = {
  margin: 0,
  top: 2,
  right: 2,
  position: 'absolute'
}

class Locks extends Component {
  renderAddWriteLockButton(field) {

    return (
      <Link
        id={`addwrite_${field.replace(/\./, '_')}`}
        key={`addwrite_${field}`}
      >
        <FlatButton
          label={`Add write lock`}
          onClick={() => {
            this.addLockField('write', field)
          }}
          />
      </Link>
    )
  }

  renderAddReadLockButton(field) {

    return (
      <Link
        id={`addread_${field.replace(/\./, '_')}`}
        key={`addread_${field}`}
      >
        <FlatButton
          label={`Add read lock`}
          onClick={() => {
            this.addLockField('read', field)
          }}
        />
      </Link>
    )
  }

  addNewPolicy(ref, field, id, type) {
    var newLockName = this.refs[ref].input.value
    if (newLockName && newLockName !== '') {
      this.props.setLock({
        entityId: id,
        entityType: type,
        field: field + "." + newLockName,
        policy: []
      })
      this.refs[ref].input.value = '';
    }
  }

  renderAddPolicyButton(field) {
    const {id, type} = this.props.params

    return (
      <GenericListItem
        key={`addPolicyList_${id}_${type}_${field},`}
        style={{rightEl: {padding: '20px'}, leftEl: {padding: '20px'}}}
        leftEl='New sub policy'
        rightEl={
          <div>
            <TextField
              ref={`addPolicy_${id}_${type}_${field}`}
              key={`addPolicy_${id}_${type}_${field}`}
              id={`addPolicy_${id.replace(/!@!/g, '_')}_${type}_${field.replace(/\./g, '_')}`}
              hintText='Name of new policy'
            />
            <span
              id={`add_${id.replace(/!@!/g, '_')}_${field.replace(/\./g, '_')}`}
              key={`add_${id}_${field}`}
              style={{
                float: 'right',
                position: 'initial',
                fontWeight: 'bold',
                width: '10%',
                color: '#008714',
                padding: '8px'
              }}
              onClick={event => {
                this.addNewPolicy(`addPolicy_${id}_${type}_${field}`, field, id, type)
              }}
            >
            ADD NEW
            </span>
          </div>
        }
      />
    )
  }

  addLock(locks, field, op) {
    const {id, type} = this.props.params
    let newLocks = this.props.policies[field].flows.map(block => block)
    newLocks.push({op, locks})
    this.props.setLock({
      entityId: id,
      entityType: type,
      field: field,
      policy: newLocks
    })
  }

  renderForm(policy, op) {
    const {form, lockFormats} = this.props
    if(form[policy] && form[policy][op]) {
      return (
        <Form
          class={'policy_lock_form'}
          id={this.props.params.id + '_' + this.props.params.type + '_' + policy + '_' + op}
          selectedForms={form[policy][op]}
          deleteFormName={forms => {
            this.props.formSelected(op, policy, forms)
          }}
          forms={lockFormats}
          submitText={'Save policy'}
          onSubmit={(e) => {
            //Iterate over all new locks added in the UI and prepare it for the format in IDM
            let i = 0
            const locks = []
            while (e.target[i]) {
              const lockInfo = e.target[i].name.split('_')
              const lockNumber = lockInfo[0]
              const lockType = lockInfo[1]
              const lockProperty = lockInfo[2]
              if (lockNumber && lockNumber !== '') {
                locks[lockNumber] = locks[lockNumber]
                  ? locks[lockNumber]
                  : {lock: lockType}

                if (e.target[i].value && lockProperty) {
                  if (locks[lockNumber].args) {
                    locks[lockNumber].args.push(e.target[i].value)
                  } else {
                    locks[lockNumber].args = [e.target[i].value]
                  }
                }
              }
              ++i
            }
            if (locks.length > 0) {
              this.addLock(locks, policy, op)
              this.removeLockField(op, policy)
            }
            this.props.formSelected(op, policy, [])
          }}
        />)
    }
    return (<div></div>)
  }

  renderOptions(options) {
    const optionFields = []
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        optionFields.push((
          <MenuItem
            key={key}
            value={key}
            primaryText={key}
          />
        ))
      }
    }
    return optionFields
  }

  renderLockField(type, policy) {
    if(this.props.lockFields[type] && this.props.lockFields[type].includes(policy)) {

      return (
        <GenericListItem
          key={`addLockList_${policy}_${type},`}
          style={{bar: {height: 'auto', margin: '0 0 10px 0'}, middleEl: {display: 'inline-block', width: '150px', padding: '0px'}, rightEl: {padding: '20px'}, leftEl: {display: 'inline-block', padding: '40px 20px 20px 20px'}}}
          leftEl={`New ${type} lock`}
          rightEl={this.renderForm(policy, type)}
          middleEl={
            <div data-tip={formSelectToolTip}>
              <ReactTooltip/>
              <SelectField
                style={{width: '100%'}}
                floatingLabelText="Add a lock"
                value={null}
                onChange={(event, index, value) => {
                  if (value !== '') {
                    let forms = Object.assign({}, this.props.form)
                    if(!forms[policy]) {
                      forms[policy] = {}
                    }
                    if(!forms[policy][type]) {
                      forms[policy][type] = []
                    }
                    forms[policy][type].push(value)
                    this.props.formSelected(type, policy, forms[policy][type])
                  }
                }}
              >
                <MenuItem value={null} label="Add a lock" primaryText="Select lock type" />
                {
                  this.renderOptions(this.props.lockFormats)
                }
              </SelectField>
            </div>
          }
        />
      )
    }
  }

  renderDeleteButton(field) {
    const {id, type} = this.props.params
    return (
      <FlatButton
        id={`delete_${id.replace(/!@!/g, '_')}_${field.replace(/\./, '_')}`}
        key={`delete_${id}_${field}`}
        label='Delete'
        onClick={() => {
          this.props.deleteLock({
            entityId: id,
            entityType: type,
            field: field
          })
        }}>
      </FlatButton>
    )
  }

  renderBlockDeleteButton(field, i) {
    const {id, type} = this.props.params
    return (
      <FloatingActionButton
        mini={true}
        id={`delete_${id.replace(/!@!/g, '_')}_${field.replace(/\./, '_')}_${i}`}
        key={`delete_${id}_${field}_${i}`}
        label='Delete'
        style={deleteButtonStyle}
        onClick={() => {
          const blocks = this.props.policies[field].flows.map(block => {
            block.locks.forEach(lock => {
              delete lock.deleteButton
              return lock
            })
            delete block.deleteButton
            return block
          }).filter((block, j) => {
            return j !== i
          })

          this.props.setLock({
            entityId: id,
            entityType: type,
            field: field,
            policy: blocks
          })
        }}>
        <ContentRemove/>
      </FloatingActionButton>
    )
  }

  renderLockDeleteButton(field, i, j) {
    const {id, type} = this.props.params
    return (
      <FloatingActionButton
        mini={true}
        id={`delete_${id.replace(/!@!/g, '_')}_${field.replace(/\./, '_')}_${i}_${j}`}
        key={`delete_${id}_${field}_${i}_${j}`}
        label='Delete'
        style={deleteButtonStyle}
        onClick={() => {
          const blocks = this.props.policies[field].flows.map((block, m) => {
            block.locks = block.locks
              .filter((lock, k) => !(m === i && k === j))
              .map(lock => {
                delete lock.deleteButton
                return lock
              })

            delete block.deleteButton
            return block
          })

          this.props.setLock({
            entityId: id,
            entityType: type,
            field: field,
            policy: blocks
          })
        }}>
        <ContentRemove/>
      </FloatingActionButton>
    )
  }

  deleteButtons(policy, block, i) {
    block.deleteButton = this.renderBlockDeleteButton(policy, i)
    if(block.locks) {
      block.locks.forEach((lock, j) => {
        lock.deleteButton = this.renderLockDeleteButton(policy, i, j)
      })
    }
  }

  addLockField(type, field) {
    if(!this.props.lockFields[type] || !this.props.lockFields[type].includes(field)) {
      this.props.addLockField({type: type, policy: field})
    }
  }

  removeLockField(type, field) {
   if(this.props.lockFields[type] && this.props.lockFields[type].includes(field)) {
      this.props.removeLockField({type: type, policy: field})
    }
  }


  renderPolicyItemComponents() {
    const result= {}
    const {policies, lockFields} = this.props
    for (let policy in policies) {
      result[policy] = policies[policy]
      result[policy].buttons = [
        this.renderDeleteButton(policy),
        this.renderAddWriteLockButton(policy),
        this.renderAddReadLockButton(policy)
      ]
      if(lockFields.write && lockFields.write.includes(policy)) {
        result[policy].buttons.push(this.renderLockField('write', policy))
      }
      if(lockFields.read && lockFields.read.includes(policy)) {
        result[policy].buttons.push(this.renderLockField('read', policy))
      }
      result[policy].buttons.push(this.renderAddPolicyButton(policy))
      result[policy].flows.forEach(this.deleteButtons.bind(this, policy))
    }
    return result
  }

  getPolicyItems() {
    let policies = this.renderPolicyItemComponents()
    let policyItems = []
    for (var policy in policies) {
      policyItems.push((<LockItem
        expandable
        showExpandableButton
        title={policy}
        policy={policies[policy]}
        key={`${this.props.params.id}_${policy}`}
        id={`${this.props.params.id}_${policy.replace(/\./g, '_')}`}
      />))
    }
    return policyItems
  }

  componentWillMount() {
    this.props.fetchEntityLocks(this.props.params.id, this.props.params.type)
    this.props.fetchLocks()
  }

  render() {
    if (this.props.policies && Object.keys(this.props.policies).length > 0) {
      return (
        <div>
          {this.getPolicyItems()}
        </div>)
    } else {
      return (<div>No locks found</div>)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    policies: state.policies,
    lockFormats: state.lockFormats,
    lockFields: state.lockFields,
    form: state.form
  }
}

const
  mapDispatchToProps = (dispatch) => {
    return {
      fetchEntityLocks: (entity_id, entity_type) => dispatch(fetchEntityLocks(entity_id, entity_type)),
      fetchLocks: () => dispatch(fetchLocks()),
      formSelected: (type, policy, formNames) => dispatch(formSelected(type, policy, formNames)),
      deleteLock: (params) => dispatch(deleteLock(params)),
      setLock: (params) => dispatch(setLock(params)),
      addLockField: (params) => dispatch(addLockField(params)),
      removeLockField: (params) => dispatch(removeLockField(params))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Locks)
