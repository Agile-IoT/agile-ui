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
import Divider from 'material-ui/Divider';
import {
  Card,
  CardActions,
  CardHeader
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

import {
  redA400,
  greenA700,
} from 'material-ui/styles/colors';

const colorCode = {
  AVAILABLE: greenA700,
  UNAVAILBLE: redA400
}

const computeColor = (status) => {
  return colorCode[status]
}

const DeviceItem = (props) => {
  const styles = {
    card: {
      marginBottom: '20px'
    },
    title: {
      fontSize: '1.2rem'
    },
    subtitle: {
      fontSize: '1rem'
    },
    divider: {
      marginRight: '16px',
      marginLeft: '16px',
      height: '1px',
      backgroundColor: '#e0e0e0'
    }
  }

  const title = (<span style={styles.title}> {props.title} </span>)
  const subtitle = (<span style={styles.subtitle}> {props.subtitle} </span>)

  return (
    <Card style={styles.card}>
      <CardHeader
        title={title}
        subtitle={subtitle}
        avatar={
          <Avatar backgroundColor={computeColor(props.status)}>
            {props.title && props.title.charAt(0)}
          </Avatar>
        }
      />
      <Divider style={styles.divider}/>
      <CardActions>
        {props.actions}
      </CardActions>
    </Card>
  );
}


export default DeviceItem
