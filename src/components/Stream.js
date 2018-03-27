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
import moment from 'moment';

import {
  Card,
  CardHeader
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';


const Stream = (props) => {
  return (
    <Card>
      <CardHeader
        title={props.componentID}
        subtitle={`Last update: ${moment(Number(props.lastUpdate)).fromNow()}`}
        avatar={<Avatar size={40}>{Math.floor(props.value)}</Avatar>}
      />
    </Card>
  );
}

export default Stream;
