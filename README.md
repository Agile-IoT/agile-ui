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
