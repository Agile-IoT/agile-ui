import React, {Component} from 'react';
import {Form} from '../components';
import {connect} from 'react-redux';
import {fetchLocks, setLock, formSelected} from '../actions';

class AddLock extends Component {

	componentDidMount() {
		this.props.fetchLocks();
	}

	addLock(data) {
		this.props.setLock({
			entityId: this.props.params.id,
			entityType: this.props.params.type,
			field: this.props.params.field,
			policy: [data]
		})
	}

	renderOptions(options) {
		let optionFields = [(<option key="emptyOption"/>)]; // Empty field
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				optionFields.push((
					<option key={key} value={key}>{key}</option>
				))
			}
		}
		return optionFields;
	}

	renderForm(formName) {
		if (formName !== '') {
			return (
				<Form
					args={this.props.policies[formName].args}
					description={this.props.policies[formName].descr}
					submitText={'Submit'}
					onSubmit={event => {
						let formData = [];
						let operation = '';
						for (var i = 0; i < this.props.policies[formName].args.length + 1; ++i) {
							if(event.target[i].name === 'operation') {
								operation = event.target[i].value;
							} else {
								formData.push(event.target[i].value);
							}
						}
						this.addLock({policies: {lock: formName, args: formData}, op: operation});
					}}
				/>
			)
		}
	}

	render() {
		return (
			<div>
				<select defaultValue={this.props.form} onChange={event => {
					this.props.formSelected(event.target.value)
				}}>
					{this.renderOptions(this.props.policies)}
				</select>
				{this.props.form !== '' ? this.renderForm(this.props.form) : undefined}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		policies: state.policies,
		form: state.form
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchLocks: () => dispatch(fetchLocks()),
		setLock: (params) => dispatch(setLock(params)),
		formSelected: (formName) => dispatch(formSelected(formName))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(AddLock);
