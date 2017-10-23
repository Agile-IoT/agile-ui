import React from 'react';
import {FloatingActionButton} from 'material-ui';
import ReactTooltip from 'react-tooltip'
import ContentRemove from 'material-ui/svg-icons/content/remove';

const renderDeleteInputField = (position, formName, formNames, deleteFormName) => {
	return (
		<FloatingActionButton mini={true} id={'delete_' + formName + '_' + position}
													key={'delete_' + formName + '_' + position}
													label='Delete'
													onClick={() => {
														deleteFormName(formNames.filter((form, i) => {
															return position !== i
														}));
													}}>
			<ContentRemove/>
		</FloatingActionButton>
	)
}

const renderInputFields = (formNames, forms, deleteFormName, onChange) => {
	return formNames.map((formName, i) => {
			if (forms[formName]) {
				if (forms[formName].args) {
					return (<div key={formName + '_' + i}
											 data-tip={forms[formName].descr}>
						<ReactTooltip globalEventOff='click'/>
						{forms[formName].name ? forms[formName].name : formName}: {forms[formName].args.map(arg => {
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
				} else {
					return (<div key={formName + '_' + i}
											 data-tip={forms[formName].descr}
											 data-multiline={true}>
						<ReactTooltip />
						<label key={'label_' + formName}>
							<input name={i + '_' + formName}
										 key={'input_' + i + '_' + formName}
										 value={formName}
										 type="text" onChange={onChange}
										 disabled/>
						</label>
						{renderDeleteInputField(i, formName, formNames, deleteFormName)}
					</div>)
				}
			}
			return null;
		}
	);
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
