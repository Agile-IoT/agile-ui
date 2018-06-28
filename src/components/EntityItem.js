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
import {
  Card,
  CardActions,
  CardHeader,
  CardText
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

const EntityItem = (props) => {
  return (
    <Card
      id={props.id}
      style={{marginBottom: '20px'}}>
      <CardHeader
        title={props.title}
        avatar={
          <Avatar
            backgroundColor={computeColor(props.status)}
            >{props.title && props.title.charAt(0)}</Avatar>
        }
      />
      <CardText>
        {props.text}
      </CardText>
      <CardActions>
        {props.actions}
      </CardActions>
    </Card>
  );
}


export default EntityItem
