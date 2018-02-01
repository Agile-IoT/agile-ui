/*******************************************************************************
 *Copyright (C) 2017 Resin.io, FBK, Jolocom.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    Resin.io, FBK, Jolocom - initial API and implementation
 ******************************************************************************/
import React from 'react';
import { FloatingActionButton } from 'material-ui';
import ReactTooltip from 'react-tooltip'
import ContentRemove from 'material-ui/svg-icons/content/remove';

const renderDeleteInputField = (position, formName, formNames, deleteFormName) => {
  const id = `delete_${formName}_${position}`;
  return (
    <FloatingActionButton
      mini={true}
      id
      key={id}
      label='Delete'
      onClick={() => {
        deleteFormName(formNames.filter((form, i) => position !== i));
      }}
    >
      <ContentRemove/>
    </FloatingActionButton>
  )
}

const renderInputFields = (formNames, forms, deleteFormName, onChange) => {
  return formNames.map((formName, i) => {
    if (forms[formName]) {
      if (forms[formName].args) {
        const title = forms[formName].name ? forms[formName].name : formName
        const value = forms[formName].args.map(arg => (
          <label key={'label_' + arg}>
            {arg}
            <input
              name={i + '_' + formName + '_' + arg}
              key={'input_' + i + '_' + formName + '_' + arg}
              type="text" onChange={onChange}
            />
          </label>
        ))

        return (
          <div key={`${formName}_${i}`} data-tip={forms[formName].descr} >
            <ReactTooltip globalEventOff='click'/>
            {title}: {value}
            {renderDeleteInputField(i, formName, formNames, deleteFormName)}
          </div>
        )
      } else {
        return (
          <div
            key={formName + '_' + i}
            data-tip={forms[formName].descr}
            data-multiline={true}
          >
            <ReactTooltip />
            <label key={'label_' + formName}>
              <input
                name={i + '_' + formName}
                key={'input_' + i + '_' + formName}
                value={formName}
                type="text" onChange={onChange}
                disabled
              />
            </label>
            {renderDeleteInputField(i, formName, formNames, deleteFormName)}
          </div>
        )
      }
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
