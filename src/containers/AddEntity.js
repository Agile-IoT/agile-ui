import React, {Component} from 'react';
import Form from 'react-jsonschema-form';
import {connect} from 'react-redux';
import {entityCreateByType, devicesCreate} from '../actions';

const deletedPropertyWarning = 'This entity type has predefined properties. ' +
  'Too add them, go to the single entity view. The predefined properties are: ';

let removedProperties = [];

class AddEntity extends Component {

  removeEmptyObjects(schema) {
    for (var prop in schema.properties) {
      if (schema.properties.hasOwnProperty(prop)) {
        if (schema.properties[prop].type === 'object' && !schema.properties[prop].properties) {
          delete schema.properties[prop];
          removedProperties.push(prop);
        }
        if (schema.properties[prop] && schema.properties[prop].type === 'object' && schema.properties[prop].properties) {
          schema.properties[prop].properties = this.removeEmptyObjects(schema.properties[prop].properties);
        }
      }
    }
    return schema;
  }

  renderForm() {
    let schema = this.props.schemas.schema.find(schema => {
      return schema.id.replace('/', '') === this.props.params.type
    });
    removedProperties = [];
    schema = this.removeEmptyObjects(schema);
    return (<div><Form schema={schema}
                       onSubmit={event => {
                        console.log(this.props.params.type);
                         this.props.entityCreate(event.formData, this.props.params.type)
                       }}
                       onError={event => console.log('ERROR', event)}/>
        {removedProperties.length > 0 ? (<div className='warning'>{'WARNING:' + deletedPropertyWarning + removedProperties}</div>): ''}
      </div>
    )
  }

  render() {
    if (this.props.schemas.schema && this.props.schemas.schema.length > 0) {
      return (
        <div>
          {this.renderForm()}
        </div>
      );
    }
    return (<div></div>)
  }
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schemas
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    entityCreate: (data, type) => dispatch(entityCreateByType(data, type)),
    devicesCreate: (device, type) => dispatch(devicesCreate(device, type))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddEntity);
