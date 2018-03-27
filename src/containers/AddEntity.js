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
import Form from 'react-jsonschema-form'
import {connect} from 'react-redux'
import {entityCreateByType, devicesCreate} from '../actions'

const deletedPropertyWarning = 'This entity type has predefined properties. ' +
  'Too add them, go to the single entity view. The predefined properties are: '

let removedProperties = []

class AddEntity extends Component {

  removeEmptyObjects(schema) {
    Object.entries(schema.properties).forEach(prop => {
      const [ key, value ] = prop

      if (value.type === 'object' && !value.properties) {
        delete schema.properties[key]
        removedProperties.push(key)
      }

      if(value && value.type === 'object' && value.properties) {
        schema.properties[key].properties =
          this.removeEmptyObjects(value.properties)
      }
    })
  }

  addIdField(schema) {
    const idKeyPresent = Object.keys(schema.properties)
      .find(p => p.toLowerCase === 'id')

    if(!idKeyPresent) {
      schema.properties.id = {type: 'string'}
      schema.required.push('id')
    }
  }

  renderForm() {
    const schema = this.props.schemas.schema.find(schema =>
      schema.id.replace('/', '') === this.props.params.type
    )

    removedProperties = []

    this.removeEmptyObjects(schema)
    if (schema.id !== '/user' && schema.id !== '/group') {
      this.addIdField(schema)
    }

    const errorMessage = removedProperties.length > 0
      ? (<div className='warning'>
          {`WARNING: ${deletedPropertyWarning} ${removedProperties}`}
        </div>)
      : null

    return (
      <div>
        <Form 
          schema={schema}
          onSubmit={e =>
            this.props.entityCreate(e.formData, this.props.params.type)
          }
          onError={event => console.log('ERROR', event)}
        />
        {errorMessage}
      </div>
    )
  }

  render() {
    if (this.props.schemas.schema && this.props.schemas.schema.length > 0) {
      return ( <div> {this.renderForm()} </div>)
    }
    return null
  }
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schemas
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    entityCreate: (data, type) => dispatch(entityCreateByType(data, type)),
    devicesCreate: (device, type) => dispatch(devicesCreate(device, type))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEntity)
