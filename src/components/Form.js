import React from 'react';

const getSelectOptions = (options) => {
	let optionInputs = [(<option key="emptyOption"/>)]; // Empty field
	optionInputs.concat(options.map(option => {
		return (<option key={option} value={option}>{option}</option>)
	}));
	return optionInputs;
}

const renderInputFields = (formNames, forms, onChange) => {
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
			})}</div>)
		}
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
	const inputs = renderInputFields(props.formNames, props.forms, props.onChange);
	return renderForm(props, inputs);
}

export default Form;
