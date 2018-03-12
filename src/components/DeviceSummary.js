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
import isEmpty from 'lodash/isEmpty';
import { List, ListItem } from 'material-ui/List';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back.js'
import { browserHistory } from 'react-router'
import IconButton from 'material-ui/IconButton'

import {
  Card,
  CardActions,
  CardHeader,
  CardText,
} from 'material-ui/Card';

const renderMeta = (meta, id) => {
  if (meta) {
    const keys = Object.keys(meta).filter(i => i !== 'streams');
    return keys.map((key, i) => {
      return (
        <ListItem key={`${id}-${key}`}>
          {key}: <code>{!isEmpty(meta[key]) ? JSON.stringify(meta[key]) : 'null'}</code>
        </ListItem>
      )
    })
  }
}

class Device extends React.Component {
  render() {
    const styles = {
      title: {fontSize: '1.2rem'},
      subtitle: {fontSize: '1rem'}
    }

    const title = (<span style={styles.title}> {this.props.title} </span>)
    const subtitle = (<span style={styles.subtitle}> {this.props.subtitle} </span>)
    return (
      <Card>
        <CardHeader
          title={title}
          subtitle={subtitle}
          actAsExpander={this.props.actAsExpander}
          showExpandableButton={this.props.showExpandableButton}
          avatar={
            <IconButton iconStyle={{transform: 'scale(1.6)'}}onClick={() => {browserHistory.goBack()}}>
              <ArrowBack color={'black'}/>
            </IconButton>
          }
        />
        <CardText expandable>
          <List>
            {renderMeta(this.props.meta, this.props.subtitle)}
          </List>
        </CardText>
        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>
    );
  }
}

export default Device
