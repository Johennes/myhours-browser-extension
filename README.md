# myhours-browser-extension

## Development

First, start the automatic rebuild with

```
yarn watchdev
```

Then, in a second terminal, launch the extension in a new browser instance via

```
yarn servedev
```

Any changes made in the source should now automatically be reflected in the running browser.

## Distribution

To build the add-on for distribution using manifest v2 (Firefox) or v3 (Chrome) run `yarn build-v2` or `yarn build-v3`, respectively. In both cases the resulting archive will be placed into the `dist/artifacts/` directory.

## License & attributions

myhours-browser-extension is licensed under the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

The myhours logo is property of [My Hours] and was downloaded from their website.

Some of the networking code was inspired by [Half-Shot/my-hours-cli].

  [My Hours]: https://myhours.com/
  [Half-Shot/my-hours-cli]: https://github.com/Half-Shot/my-hours-cli
