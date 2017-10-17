import React from 'react';

const getSelectOptions = (options) => {
	let optionInputs = [(<option key="emptyOption"/>)]; // Empty field
	optionInputs.concat(options.map(option => {
		return (<option key={option} value={option}>{option}</option>)
	}));
	return optionInputs;
}

const getInputFields = (args, onChange) => {
	return args.map(arg => {
		if (arg !== Object(arg)) {
			return (
				<label key={'label_' + arg}>
					{arg}
					<input name={arg} key={'input_' + arg} type="text" onChange={onChange}/>
				</label>
			)
		} else {
			const keys = Object.keys(arg);
			if(Array.isArray(arg[keys[0]])) {
				return (
					<label key={'label_' + keys[0]}>
						{keys[0]}
						<select name={keys[0]} key={'input_' + keys[0]} type="text" onChange={onChange}>
							{getSelectOptions(arg[keys[0]])}
						</select>
					</label>
				)
			}
		}
		return (<div></div>)
	});
}

const Form = (props) => {
	return (
		<div>
			<h2>{props.description}</h2>
		<form onSubmit={event => {
			event.preventDefault();
			props.onSubmit(event)
		}}>
			{props.options}
			{getInputFields(props.args, props.onChange)}
			<input type='submit' value={props.submitText}/>
		</form>
		</div>
	);
}

export default Form;
