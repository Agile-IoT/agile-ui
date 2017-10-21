import React from 'react';
import {FloatingActionButton} from 'material-ui';
import ContentRemove from 'material-ui/svg-icons/content/remove';

const renderDeleteInputField = (position, formName, formNames, deleteFormName) => {
  return (
    <FloatingActionButton mini={true} id={'delete_' + formName + '_' + position}
                          key={'delete_' + formName + '_' + position}
                          label='Delete'
                          onClick={() => {
                            deleteFormName(formNames.filter((form, i) => {return position !== i}));
                          }}>
      <ContentRemove/>
    </FloatingActionButton>
  )
}

const renderInputFields = (formNames, forms, deleteFormName, onChange) => {
  return formNames.map((formName, i) => {
    if (forms[formName]) {
      return (<div key={formName + '_' + i}>
        {formName}: {forms[formName].args.map(arg => {
        return (
          <label key={'label_' + arg}>
            {arg}
            <input name={i + '_' + formName + '_' + arg}
                   key={'input_' + i + '_' + formName + '_' + arg}
                   type="text" onChange={onChange}/>
          </label>
        )
      })}
        {renderDeleteInputField(i, formName, formNames, deleteFormName)}
      </div>)
    }
    return null;
  });
}

const renderForm = (props, inputs) => {
  return (
    <div>
      <form onSubmit={event => {
        event.preventDefault();
        props.onSubmit(event)
      }}>
        {props.options}
        {inputs}
        <input type='submit' value={props.submitText}/>
      </form>
    </div>
  );
}

const Form = (props) => {
  const inputs = renderInputFields(props.formNames, props.forms, props.deleteFormName, props.onChange);
  return renderForm(props, inputs);
}

export default Form;
