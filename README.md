# Album Art Getter
Are you tired of having dull-looking podcast visuals but don't want to spend all that time browsing for album art for each of your songs? Do you have an awesome remix of a song but are too lazy to sift through hundreds of image results when making album art for your remix? Then this Node script could be a potential solution for your troubles.

## Prerequisites
- Node

## Usage
Simply clone this repository, install the necessary dependencies, and run `node main.js <artist> <song name> [<size in pixels>px | <scale>x] [-<API mode>] [<output file/format>]` on the command line. The artist and song name must come first in order. The other parameters are optional and can be passed in any order.

The following API modes are valid, with mode 1 as the default mode:
- 1: [Lololyrics API](http://api.lololyrics.com/)
- 2: [Spotify Web API](https://developer.spotify.com/web-api/)

The following image types are supported:
- BMP
- JPEG/JPG
- PNG

## History

### 0.3.0 (2017-02-23)
- output file/format parameter

### 0.2.0 (2017-02-20)
- added support for Spotify Web API requests
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

## Credits
- [Jimp](https://github.com/oliver-moran/jimp) - JavaScript image processing library for Node
- [Lololyrics API](http://api.lololyrics.com/)
- [Spotify Web API](https://developer.spotify.com/web-api/)

## A Couple of Things, Though
1. This is a work in progress. There's the issues tab if you need to say anything.
2. This project, which is something I'm doing on the side for fun, is in no way affiliated with Spotify or Lololyrics.com.
3. It's not my fault if either API is down. I'll try to add support for as many APIs/websites as possible.
4. It's also not my fault if, all of a sudden, you can't run this script anymore because you went over a request limit. I wouldn't download images using this script constantly/excessively lest you go over specified request limits.

## Contributing
Feel free to submit a pull request if you think you can make this better!

## Contact Information
- Email: sunquan8094 at gmail dot com
