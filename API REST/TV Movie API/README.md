TV Movie API
============
#### _An objectivly better TV Series and Movie API._

It contains:
 - Metadata about movies (taken from [Trakt](http://trakt.tv/))
 - Metadata about TV Shows and individual episodes (taken from [Trakt](http://trakt.tv/))
 - Multiple quality magnet links for every movie and episode
 - Ability to easily filter content to the users' content

Installation
============
1. Install MongoDB (version `3.0+`)
2. Install NodeJS (version `5.0.0+`)
3. install dependencies `cd tv-movie-api` and `npm install`
4. Start the API using either of the following,
 - `npm start` 
 - `node --harmony --harmony_destructuring --harmony_default_parameters --use_strict index.js`

Routes
======
The API contains the following 'routes' which produce the example output:

`show/:imdb_id` - This returns all info and episodes for a particular show. Useful for the "show details" page in your app.

`movie/:imdb_id` - This returns all info and episodes for a particular movie.

**Example**

`http://<api-url>/show/tt1475582` returns the following:

```
{
  "_id": "tt1475582",
  "imdb_id": "tt1475582",
  "tvdb_id": "176941",
  "title": "Sherlock",
  "year": "2010",
  "slug": "sherlock",
  "synopsis": "Sherlock is a British television crime drama that presents a contemporary adaptation of Sir Arthur Conan Doyle's Sherlock Holmes detective stories. Created by Steven Moffat and Mark Gatiss, it stars Benedict Cumberbatch as Sherlock Holmes and Martin Freeman as Doctor John Watson.",
  "runtime": "90",
  "rating": {
    "hated": 100,
    "loved": 100,
    "votes": 22043,
    "watching": 5,
    "percentage": 93
  },
  "country": "gb",
  "network": "BBC One",
  "air_day": "Sunday",
  "air_time": "20:30",
  "status": "returning series",
  "num_seasons": 3,
  "last_updated": 1458394535176,
  "images": {
    "fanart": "https://walter.trakt.us/images/shows/000/019/792/fanarts/original/605985cad2.jpg",
    "poster": "https://walter.trakt.us/images/shows/000/019/792/posters/original/6311e0343c.jpg",
    "banner": "https://walter.trakt.us/images/shows/000/019/792/banners/original/ca665b6d1d.jpg"
  },
  "__v": 29,
  "episodes": [
    {
      "tvdb_id": 4103396,
      "season": 2,
      "episode": 1,
      "title": "A Scandal in Belgravia",
      "overview": "Compromising photographs and a case of blackmail threaten the very heart of the British establishment, but for Sherlock and John the game is on in more ways than one as they find themselves battling international terrorism, rogue CIA agents, and a secret conspiracy involving the British government.  This case will cast a darker shadow over their lives than they could ever imagine, as the great detective begins a long duel of wits with an antagonist as cold and ruthless and brilliant as himself: to Sherlock Holmes, Irene Adler will always be THE woman.",
      "date_based": false,
      "first_aired": 1325449800,
      "watched": {
        "watched": false
      },
      "torrents": {
        "0": {
          "provider": "EZTV",
          "peers": 0,
          "seeds": 0,
          "url": "magnet:?xt=urn:btih:T6Y4FG35S54U3CWSV2OPAXRQVXHZJ4WV&dn=Sherlock.2x01.A.Scandal.In.Belgravia.HDTV.XviD-FoV&tr=udp://tracker.openbittorrent.com:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://exodus.desync.com:6969"
        },
        "720p": {
          "provider": "EZTV",
          "peers": 0,
          "seeds": 0,
          "url": "magnet:?xt=urn:btih:GHB4ZITTAO3AMXKNQ4ODBHMFT426NHYU&dn=Sherlock.2x01.A.Scandal.In.Belgravia.720p.HDTV.x264-FoV&tr=udp://tracker.openbittorrent.com:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://exodus.desync.com:6969"
        },
        "480p": {
          "provider": "EZTV",
          "peers": 0,
          "seeds": 0,
          "url": "magnet:?xt=urn:btih:T6Y4FG35S54U3CWSV2OPAXRQVXHZJ4WV&dn=Sherlock.2x01.A.Scandal.In.Belgravia.HDTV.XviD-FoV&tr=udp://tracker.openbittorrent.com:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://exodus.desync.com:6969"
        }
      }
    },
    ...
  ],
  "genres": [
    "drama",
    "crime",
    "mystery"
  ]
}
```

`shows/` - Returns the number of pages available to list 50 shows at a time (used for pagination etc).

`movies/` - Returns the number of pages available to list 50 movies at a time.

`shows/:page` - Retuns a list of 50 shows with part of the metadata (For showing whats avalible to watch).

`movies/:page` - Retuns a list of 50 movies with part of the metadata.

**Example**

`http://<api-url>/shows/1`

```
[
  {
    "_id": "tt0944947",
    "imdb_id": "tt0944947",
    "tvdb_id": "121361",
    "title": "Game of Thrones",
    "year": "2011",
    "slug": "game-of-thrones",
    "rating": {
      "hated": 100,
      "loved": 100,
      "votes": 44234,
      "watching": 37,
      "percentage": 94
    },
    "num_seasons": 5,
    "last_updated": 1458401017618,
    "images": {
      "fanart": "https://walter.trakt.us/images/shows/000/001/390/fanarts/original/76d5df8aed.jpg",
      "poster": "https://walter.trakt.us/images/shows/000/001/390/posters/original/93df9cd612.jpg",
      "banner": "https://walter.trakt.us/images/shows/000/001/390/banners/original/9fefff703d.jpg"
    }
  },
  {
    "_id": "tt0903747",
    "imdb_id": "tt0903747",
    "tvdb_id": "81189",
    "title": "Breaking Bad",
    "year": "2008",
    "slug": "breaking-bad",
    "rating": {
      "hated": 100,
      "loved": 100,
      "votes": 38219,
      "watching": 13,
      "percentage": 94
    },
    "num_seasons": 5,
    "last_updated": 1458396988175,
    "images": {
      "fanart": "https://walter.trakt.us/images/shows/000/001/388/fanarts/original/fdbc0cb02d.jpg",
      "poster": "https://walter.trakt.us/images/shows/000/001/388/posters/original/fa39b59954.jpg",
      "banner": "https://walter.trakt.us/images/shows/000/001/388/banners/original/c53872a7e2.jpg"
    }
  },
  {
    "_id": "tt0898266",
    "imdb_id": "tt0898266",
    "tvdb_id": "80379",
    "title": "The Big Bang Theory",
    "year": "2007",
    "slug": "the-big-bang-theory",
    "rating": {
      "hated": 100,
      "loved": 100,
      "votes": 34414,
      "watching": 33,
      "percentage": 85
    },
    "num_seasons": 5,
    "last_updated": 1458401011376,
    "images": {
      "fanart": "https://walter.trakt.us/images/shows/000/001/409/fanarts/original/cff0b01ee7.jpg",
      "poster": "https://walter.trakt.us/images/shows/000/001/409/posters/original/8adfe77938.jpg",
      "banner": "https://walter.trakt.us/images/shows/000/001/409/banners/original/cfd96bef0d.jpg"
    }
  },
  ...
]
```

`shows/select/:ids` - Returns array of shows (matching the ids) with part of the metadata.

`movies/select/:ids` - Returns array of movies (matching the ids) with part of the metadata.

**Example**

`http://<api-url>/shows/select/tt3032476,tt4532368,tt2364582`

```
[
  {
    "_id": "tt3032476",
    "imdb_id": "tt3032476",
    "tvdb_id": "273181",
    "title": "Better Call Saul",
    "year": "2015",
    "slug": "tt3032476",
    "rating": {
      "percentage": 86,
      "watching": 49,
      "votes": 4391,
      "loved": 100,
      "hated": 100
    },
    "num_seasons": 2,
    "images": {
      "banner": "https://walter.trakt.us/images/shows/000/059/660/banners/original/3f00b6cebf.jpg",
      "poster": "https://walter.trakt.us/images/shows/000/059/660/posters/original/a847b27956.jpg",
      "fanart": "https://walter.trakt.us/images/shows/000/059/660/fanarts/original/5885092434.jpg"
    }
  },
  {
    "_id": "tt4532368",
    "imdb_id": "tt4532368",
    "tvdb_id": "295760",
    "title": "DC's Legends of Tomorrow",
    "year": "2016",
    "slug": "dc-s-legends-of-tomorrow",
    "rating": {
      "percentage": 76,
      "watching": 52,
      "votes": 860,
      "loved": 100,
      "hated": 100
    },
    "num_seasons": 1,
    "images": {
      "banner": "https://walter.trakt.us/images/shows/000/098/898/banners/original/fc5fc1bb56.jpg",
      "poster": "https://walter.trakt.us/images/shows/000/098/898/posters/original/7ecb6f08f0.jpg",
      "fanart": "https://walter.trakt.us/images/shows/000/098/898/fanarts/original/cfbbb12db3.jpg"
    }
  },
  ...
]
```

**Sorting**

Most API results can be sorted and filtered with the following query string:

`?sort=`

Possible options are:
- Name: sort by title of the movie/show
- Year: sort by the year the movie/show first aired
- Updated sort by the most recently aired movie/show
- Rating: sort by the highest rated movies/shows
- Trending: sort by which moves/shows are trending

You can change the order of the sort by adding `&order=1` or `&order=-1` to the query string.

**Filtering**

There are 3 ways of filtering content:
 - `?keywords=`: filter content by keywords (for search functionality)
 - `?genre=`: filter content based on genres
 - `?quality=`: **_movies only_** filter content by quality avaliable

These filters can be used separately or together.

Versioning
==========
For transparency and insight into our release cycle, and for striving to maintain backward compatibility, this project will be maintained according to the [Semantic Versioning](http://semver.org/) guidelines as much as possible.

Releases will be numbered with the following format: `<major>.<minor>.<patch>-<build>`

Constructed with the following guidelines:
- A new _major_ release indicates a large change where backwards compatibility is broken.
- A new _minor_ release indicates a normal change that maintains backwards compatibility.
- A new _patch_ release indicates a bugfix or small change which does not affect compatibility.
- A new _build_ release indicates this is a pre-release of the version.

License
=======
If you distribute a copy or make a fork of the project, you have to credit this project as source. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program.  If not, see [http://www.gnu.org/licenses/](http://www.gnu.org/licenses/).

--------------------------------------------------------------------------------

**This project and the distribution of this project is not illegal, nor does it violate _any_ DMCA laws. The use of this project, however, may be illegal in your area. Check your local laws and regulations regarding the use of torrents to watch potentially copyrighted content. The maintainers of this project do not condone the use of this project for anything illegal, in any state, region, country, or planet. _Please use at your own risk_.**

--------------------------------------------------------------------------------

Copyright (c) 2016 - TV Movie API - Released under the [GPL v3 license](LICENSE.txt).
