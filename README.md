# Album Art Getter
Are you tired of having dull-looking podcast visuals but don't want to spend all that time browsing for album art for each of your songs? Then this Node script could be a potential solution for your troubles.

## Prerequisites
- NodeJS

## Usage
Simply clone this repository, install the necessary dependencies, and run `node main.js <artist> <song name> [<size in pixels>px | <scale>x] [-<API mode>]` on the command line. The artist and song name must come first in order. The remaining two parameters are optional and can be passed in either order.

The following API modes are valid, with mode 1 as the default mode:
- 1: [Lololyrics API](http://api.lololyrics.com/)
- 2: [Spotify Web API](https://developer.spotify.com/web-api/)

## History

### 0.2.0 (2017-02-20)
- added support for Spotify API requests
- API mode parameter

### 0.1.1 (2017-02-20)
- fixed and optimized resize parameter validation

### 0.1.0 (2017-02-20)
- modularized main script
- added parameter validation tests
- added optional image resizing and scaling via command line

### 0.0.1 (2017-02-19)
- support for [lololyrics.com](lololyrics.com) requests added

## Features in Progress
- ability to pass multiple songs as parameters
- support for other websites (may require API credentials)
- image manipulation (output to other formats)

## Contributing
Feel free to submit a pull request if you think you can make this better!

## Contact Information
- Email: sunquan8094 at gmail dot com
