<!--
# Copyright (C) 2017 Resin.io, FBK, Jolocom.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License 2.0
# which accompanies this distribution, and is available at
# https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0
# 
# Contributors:
#     Resin.io, FBK, Jolocom - initial API and implementation
-->

## Development

```
npm install
```

Make sure you are running all agile services locally with [agile-cli](https://github.com/Agile-IoT/agile-cli).

Run dev server:
```
npm start
```

## Connecting to a real device while developing:

If you need to test against a real device. Open the [package.json](/package.json) and change alter the "proxy" object to your liking, replacing the `0.0.0.0` -> with the IP address of your device.
