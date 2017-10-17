import React from 'react';
import {
	Card,
	CardText,
	CardHeader,
	CardActions
} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import InlineEdit from 'react-edit-inline';

const changedData = (data) => {
	console.log(data);
}

const getArrayArgsListItems = (args, lock) => {
	return args.map((arg, i) => {
		return (<ListItem key={`arg_${i}`}>
				{i}: {(
				<InlineEdit activeClassName='editing'
										text={'' + arg}
										change={changedData}
										paramName={lock + '[' + i + ']'}
				/>)}
			</ListItem>
		);
	});
}

const getArgsListItems = (args, lock) => {
	let itemList = [];
	for (var arg in args) {
		if(arg !== 'deleteButton') {
			itemList.push(<ListItem key={`${arg}`}>
					{arg}: {
					Array.isArray(args[arg]) ?
						(<List>{getArrayArgsListItems(args[arg], lock + '.' + arg)}</List>) :
						(<InlineEdit activeClassName='editing'
												 text={'' + args[arg]}
												 change={changedData}
												 paramName={lock + '.' + arg}
						/>)
				}
				</ListItem>
			);
		}
	}
	return (<List>{itemList}</List>);
}

const getLocksListItems = (locks, op) => {
	let listItems = [];
	for (var lock in locks) {
		listItems.push((
			<ListItem key={`${lock}`}>
				{getArgsListItems(locks[lock], op + '.' + lock)}
				{locks[lock].deleteButton}
			</ListItem>
		))
	}
	return listItems;
}

const getListItems = (locks) => {
	if(locks) {
		return locks.map((lock, i) => {
			return (
				<ListItem key={`${i}_${lock.op}`}>
					{`${lock.op}`}
					{(<List>
						{getLocksListItems(lock.locks, lock.op)}
						{lock.deleteButton}
					</List>)}
				</ListItem>
			)
		});
	}
}

const LockItem = (props) => {
	return (
		<Card
			style={{marginBottom: '20px'}}>
			<CardHeader
				actAsExpander={props.actAsExpander}
				showExpandableButton={props.showExpandableButton}
				title={props.title}
				subtitle={props.subtitle}
			/>
			<CardText expandable>
				<List>{getListItems(props.policy.flows)}</List>
			</CardText>
			<CardActions>
				{props.policy.buttons}
			</CardActions>
		</Card>);
};

export default LockItem
