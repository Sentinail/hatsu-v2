'use client'

import axios from 'axios'
import {
  cache,
  getCached,
  getNormalizedQueryKey,
  hash,
} from '../local_db/cache'
import moment from 'moment'

class Anilist {
  readonly baseUrl = 'https://graphql.anilist.co'
  readonly apiUrl = 'https://consumet-org-api-59hc.vercel.app'

  searchAnime = async (
    {
      search = '',
      page = 1,
      perPage = 10,
      formatNotIn = [],
      sort = 'POPULARITY_DESC',
      genreIn = [],
      statusIn = [],
      isCached = false,
    }: {
      search?: string
      page?: number
      perPage?: number
      formatNotIn?: string[]
      sort?: string
      genreIn?: string[]
      statusIn?: string[]
      isCached?: boolean
    } = {
      search: '',
      page: 1,
      perPage: 10,
      formatNotIn: [],
      sort: 'POPULARITY_DESC',
      genreIn: [],
      statusIn: [],
      isCached: false,
    }
  ) => {
    try {
      console.log("Running Query")

      const query = /* GraphQL */ `
        query (
          $search: String
          $page: Int
          $perPage: Int
          $formatNotIn: [MediaFormat]
          $sort: [MediaSort]
          $genreIn: [String]
          $statusIn: [MediaStatus]
        ) {
          Page(page: $page, perPage: $perPage) {
            pageInfo {
              total
              currentPage
              lastPage
              hasNextPage
              perPage
            }
            media(
              search: $search
              format_not_in: $formatNotIn
              sort: $sort
              genre_in: $genreIn
              status_in: $statusIn
            ) {
              id
              title {
                english
                native
                romaji
                userPreferred
              }
              description
              bannerImage
              coverImage {
                large
                color
                extraLarge
                medium
              }
              format
              status
              genres
              averageScore
              season
              seasonYear
              episodes
              duration
              popularity
            }
          }
        }
      `

      const variables: any = {
        page,
        perPage,
        sort,
        formatNotIn: [
          "MANGA",
          "MUSIC",
          "NOVEL",
          "ONE_SHOT"
        ],
      };

      if (search) variables.search = search;
      if (formatNotIn.length) variables.formatNotIn = formatNotIn;
      if (genreIn.length) variables.genreIn = genreIn;
      if (statusIn.length) variables.statusIn = statusIn;

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        const cachedData = await getCached(normalizedQueryKey)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.post(this.baseUrl, {
        query,
        variables,
      })

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        await cache(normalizedQueryKey, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to search anime', { e })
    }
  }

  fetchEpisodeStream = async (
    {
      id,
      isCached = false,
    }: {
      id: string
      isCached?: boolean
    } = {
      id: '',
      isCached: false,
    }
  ) => {
    try {
      const url = `${this.apiUrl}/meta/anilist/watch/${id}`

      const params = {
        provider: 'zoro',
      }

      const hashedUrl = await getNormalizedQueryKey(
        this.baseUrl,
        "GET",
        params
      )

      if (isCached) {
        const cachedData = await getCached(hashedUrl)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.get(url, {
        params: {
          provider: 'zoro',
        },
      })

      if (isCached) {
        await cache(hashedUrl, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to fetch episode stream', { e })

    }
  }

  fetchAnimeInfo = async (
    {
      id,
      isCached = false,
    }: {
      id: string
      isCached?: boolean
    } = {
      id: '',
      isCached: false,
    }
  ) => {
    try {
      const query = /* GraphQL */ `
        query ($mediaId: Int, $sort: [RecommendationSort]) {
          Media(id: $mediaId) {
            id
            title {
              romaji
              english
              native
              userPreferred
            }
            description
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            format
            episodes
            status
            startDate {
              day
              month
              year
            }
            season
            studios {
              nodes {
                name
              }
            }
            genres
            duration
            averageScore
            popularity
            characters {
              nodes {
                id
                name {
                  first
                  middle
                  last
                  full
                  native
                  alternative
                  alternativeSpoiler
                  userPreferred
                }
                image {
                  large
                  medium
                }
                gender
              }
            }
            recommendations(sort: $sort) {
              nodes {
                mediaRecommendation {
                  id
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  format
                  coverImage {
                    extraLarge
                    large
                    medium
                    color
                  }
                }
              }
            }
          }
        }
      `

      const variables = {
        mediaId: id,
        sort: 'RATING_DESC',
      }

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        const cachedData = await getCached(normalizedQueryKey)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.post(this.baseUrl, {
        query,
        variables,
      })

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        await cache(normalizedQueryKey, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to fetch anime info', { e })
    }
  }

  fetchAnimeEpisodes = async (
    {
      id,
      isCached = false,
    }: {
      id: string
      isCached?: boolean
    } = {
      id: '',
      isCached: false,
    }
  ) => {
    try {
      const url = `${this.apiUrl}/meta/anilist/episodes/${id}`

      const params = {
        provider: 'zoro',
      }

      const hashedUrl = await getNormalizedQueryKey(
        this.baseUrl,
        "GET",
        params
      )

      if (isCached) {
        const cachedData = await getCached(hashedUrl)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.get(url, {
        params: {
          provider: 'zoro',
        },
      })

      if (isCached) {
        await cache(hashedUrl, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to fetch anime episodes', { e })
    }
  }

  fetchPopularAnime = async (
    {
      page = 1,
      perPage = 6,
      isCached = false,
    }: {
      page?: number
      perPage?: number
      isCached?: boolean
    } = {
      page: 1,
      perPage: 6,
      isCached: false,
    }
  ) => {
    try {
      const query = /* GraphQL */ `
        query Query($page: Int, $perPage: Int, $sort: [MediaSort]) {
          Page(page: $page, perPage: $perPage) {
            media(sort: $sort) {
              id
              title {
                english
                native
                romaji
                userPreferred
              }
              description
              bannerImage
              coverImage {
                large
                color
                extraLarge
                medium
              }
              status
              genres
              averageScore
              season
            }
          }
        }
      `

      const variables = {
        page,
        perPage,
        sort: 'POPULARITY_DESC',
      }

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        const cachedData = await getCached(normalizedQueryKey)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.post(this.baseUrl, {
        query,
        variables,
      })

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        await cache(normalizedQueryKey, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to fetch popular anime', { e })
    }
  }

  fetchLatestReleaseAnime = async (
    {
      page = 1,
      perPage = 6,
      isCached = false,
    }: {
      page?: number
      perPage?: number
      isCached?: boolean
    } = {
      page: 1,
      perPage: 6,
      isCached: false,
    }
  ) => {
    try {
      const query = /* GraphQL */ `
        query Query(
          $page: Int
          $perPage: Int
          $sort: [MediaSort]
          $statusIn: [MediaStatus]
          $type: MediaType
          $isAdult: Boolean
        ) {
          Page(page: $page, perPage: $perPage) {
            media(
              sort: $sort
              status_in: $statusIn
              type: $type
              isAdult: $isAdult
            ) {
              id
              title {
                english
                native
                romaji
                userPreferred
              }
              description
              bannerImage
              coverImage {
                large
                color
                extraLarge
                medium
              }
              status
              genres
              averageScore
              season
              type
            }
          }
        }
      `

      const variables = {
        page,
        perPage,
        sort: 'START_DATE_DESC',
        statusIn: 'RELEASING',
        type: 'ANIME',
        isAdult: false,
      }

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        const cachedData = await getCached(normalizedQueryKey)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.post(this.baseUrl, {
        query,
        variables,
      })

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        await cache(normalizedQueryKey, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to fetch latest release anime', { e })
    }
  }

  fetchTrendingAnime = async (
    {
      page = 1,
      perPage = 6,
      isCached = false,
    }: {
      page?: number
      perPage?: number
      isCached?: boolean
    } = {
      page: 1,
      perPage: 6,
      isCached: false,
    }
  ) => {
    try {
      const query = /* GraphQL */ `
        query Query($page: Int, $perPage: Int, $sort: [MediaSort]) {
          Page(page: $page, perPage: $perPage) {
            media(sort: $sort) {
              id
              title {
                english
                native
                romaji
                userPreferred
              }
              description
              bannerImage
              coverImage {
                large
                color
                extraLarge
                medium
              }
              status
              genres
              averageScore
              season
            }
          }
        }
      `

      const variables = {
        page,
        perPage,
        sort: 'TRENDING_DESC',
      }

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        const cachedData = await getCached(normalizedQueryKey)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.post(this.baseUrl, {
        query,
        variables,
      })

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        await cache(normalizedQueryKey, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to fetch trending anime', { e })
    }
  }

  fetchUpcomingEpisodes = async (
    {
      page = 1,
      perPage = 4,
      isCached = false,
    }: {
      page?: number
      perPage?: number
      isCached?: boolean
    } = {
      page: 1,
      perPage: 4,
      isCached: false,
    }
  ) => {
    try {
      const secondsUnixEpoc = moment().startOf('hour').unix()
      const secondsUnixWeek = moment()
        .subtract(7, 'days')
        .startOf('hour')
        .unix()

      const query = /* GraphQL */ `
                query Query($page: Int, $perPage: Int, $sort: [AiringSort]) {
                    Page(page: $page, perPage: $perPage) {
                        airingSchedules(sort: $sort airingAt_lesser: ${secondsUnixEpoc}, airingAt_greater: ${secondsUnixWeek}) {
                            media {
                                id
                                title {
                                    english
                                    native
                                    romaji
                                    userPreferred
                                }
                                coverImage {
                                    extraLarge
                                    large
                                    medium
                                    color
                                }
                                status
                            }
                            episode
                            timeUntilAiring
                            airingAt
                        }
                    }
                }
            `

      const variables = {
        page,
        perPage,
        sort: 'TIME_DESC',
      }

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        const cachedData = await getCached(normalizedQueryKey)

        if (cachedData) {
          return cachedData
        }
      }

      const response = await axios.post(this.baseUrl, {
        query,
        variables,
      })

      if (isCached) {
        const normalizedQueryKey = await getNormalizedQueryKey(
          this.baseUrl,
          "POST",
          { query, variables }
        )

        await cache(normalizedQueryKey, response.data)
      }

      return response.data
    } catch (e) {
      console.log('Failed to fetch upcoming episodes', { e })
    }
  }
}

export default Anilist
