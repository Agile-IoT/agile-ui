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
import React from 'react';
import ReactTooltip from 'react-tooltip'
import RemoveIcon from 'material-ui/svg-icons/action/delete-forever'

const renderDeleteInputField = (position, formName, formNames, deleteFormName) => {
  const id = `delete_${formName}_${position}`;
  const removeButtonStyle = {
    cursor: "pointer",
    float: "right"
  }

  return (
    <RemoveIcon
      id={id}
      style={removeButtonStyle}
      onClick={() => {
        deleteFormName(formNames.filter((form, i) => position !== i));
      }}
    />
  )
}

const renderInputFields = (formNames, forms, deleteFormName, onChange) => {
  return formNames.map((formName, i) => {
    if (forms[formName]) {
      if (forms[formName].args) {
        const title = forms[formName].name ? forms[formName].name : formName
        const value = forms[formName].args.map(arg => (
          <label style={{width: '250px', display: 'block'}} key={'label_' + arg}>
            {arg}
            <input
              style={{width: '150px', margin: '10px'}}
              name={i + '_' + formName + '_' + arg}
              key={'input_' + i + '_' + formName + '_' + arg}
              type="text" onChange={onChange}
            />
          </label>
        ))

        return (
          <div style={{border: "1px solid grey", margin: "1px 0 0 1px", padding: "15px"}} key={`${formName}_${i}`}
               data-tip={forms[formName].descr}>
            <ReactTooltip globalEventOff='click'/>
            {renderDeleteInputField(i, formName, formNames, deleteFormName)}
            {title}: {value}
          </div>
        )
      } else {
        return (
          <div
            style={{border: "1px solid grey", margin: "1px 0 0 1px", padding: "15px"}}
            key={formName + '_' + i}
            data-tip={forms[formName].descr}
            data-multiline={true}
          >
            <ReactTooltip/>
            {renderDeleteInputField(i, formName, formNames, deleteFormName)}
            <label key={'label_' + formName}>
              <input
                name={i + '_' + formName}
                key={'input_' + i + '_' + formName}
                value={formName}
                type="text" onChange={onChange}
                disabled
              />
            </label>
          </div>
        )
      }
    }
    return null;
  });
}

const renderForm = (props, inputs) => {
  const id = `newLockForm_${props.id.replace(/!@!/, '-').replace(/\./, '-')}`
  return (
    <div>
      <form
        id={id}
        onSubmit={event => {
        event.preventDefault();
        props.onSubmit(event)
      }}>
        {props.options}
        {inputs}
        <input style={{display: 'none'}} id={id + '_button'} type={'submit'} value={props.submitText}/>
      </form>
      <span

        style={{
          float: 'right',
          position: 'initial',
          fontWeight: 'bold',
          width: '10%',
          color: '#008714',
          padding: '8px',
          margin: '5px 25px 0 0'
        }}
        onClick={event => {
          event.preventDefault()
          document.getElementById(id + '_button').click()
        }}
      >
            SAVE POLICY
            </span>
    </div>
  );
}

const Form = (props) => {
  const inputs = renderInputFields(props.selectedForms, props.forms, props.deleteFormName, props.onChange);
  return renderForm(props, inputs);
}

export default Form;
