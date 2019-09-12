const communityModule = (function() {
  'use strict';
  let DOM = {};
  const api = {
    github: 'https://api.github.com/search/repositories?q=repo:VowpalWabbit/vowpal_wabbit',
    github_contributors: 'https://api.github.com/repos/VowpalWabbit/vowpal_wabbit/contributors?per_page=1',
    stackoverflow: 'https://api.stackexchange.com/2.2/search/advanced?page=1&pagesize=1&order=desc&sort=activity&tagged=vowpalwabbit&site=stackoverflow'
  };

  function init() {
    cacheDom();
    fetchCardContent();
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$community_cards = $(".community_container .community");
    DOM.$github = $(".community_container .github .card_content");
    DOM.$stackoverflow = $(".community_container .stackoverflow .card_content");
    DOM.$gitter = $(".community_container .gitter .card_content");
  }

  function fetchCardContent() {
    DOM.$community_cards.each((_, card) => {
      const $card = $(card);
      const title = $card.find(".community_title .text").text().trim().toLowerCase();

      switch (title) {
        case 'github':
          getGithubContent();
          break;
        case 'stack overflow':
          getStackOverflowContent();
          break;
        case 'gitter':
          getGitterContent();
          break;
        default:
          break;
      }
    });
  }

  function getGithubContent() {
    Promise.all([
      fetchGitContributors(),
      fetchGitStarsAndForks()
    ])
    .then((response) => {
      const counts = response.flat();
      const rows = [
        {
          icon: 'fa-users',
          label: 'Contributors',
          count: counts[0]
        },
        {
          icon: 'fa-star',
          label: 'Stars',
          count: counts[1]
        },
        {
          icon: 'fa-code-fork',
          label: 'Forks',
          count: counts[2]
        }
      ];
      const github_content = rows.map((row) => {
        return (
          '<div class="card_row">' +
            '<div class="card_label">' +
              '<div class="icon">' +
                '<i class="fas '+ row.icon +'"></i>' +
              '</div>' +
              '<div class="text">' +
                row.label +
              '</div>' +
            '</div>' +
            '<div class="count">' +
              row.count.toLocaleString() +
            '</div>' +
          '</div>'
        );
      });
      DOM.$github.find('.loader_wrapper').hide();
      DOM.$github.append(github_content);
    });
  }

  function fetchGitContributors() {
    return fetch(api.github_contributors, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      let contributors;

      Array.from(response.headers).forEach((arr) => {
        if (arr[0] === 'link') {
          const url =  new URLSearchParams(arr[1].split(', ')[1].split('; ')[0].slice(1, -1));
          contributors = Number(url.get('page'));
        }
      });

      return [contributors]
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function fetchGitStarsAndForks() {
    return fetch(api.github, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const {
        stargazers_count: stars,
        forks_count: forks,
      } = data.items[0];

      return [stars, forks];
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function getStackOverflowContent() {
    return fetch(api.stackoverflow)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const {
          title,
          creation_date
        } = data.items[0];

        const stackoverflow_content = '<p class="title">' +
          'Latest Question' +
        '</p>' +
        '<div class="question">' +
          title +
        '</div>' +
        '<div class="time">' +
          new Date(creation_date * 1000).toLocaleDateString() +
        '</div>';

        DOM.$stackoverflow.find('.loader_wrapper').hide();
        DOM.$stackoverflow.append(stackoverflow_content);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getGitterContent() {
    const avatars = Array.from(Array(5).keys()).map((i)=> {
      return (
        "<div class='avatar'>" +
          "<img src='/assets/images/community/user"+ i +".png' alt='gitter avatar'/>" +
        "</div>"
      );
    }).join('');

    const gitter_content = '<p class="title">' +
      'People' +
    '</p>' +
    '<div class="avatars">' +
      avatars +
    '</div>' +
    '<div class="note">' +
      '+ More members'
    '</div>';

    DOM.$gitter.find('.loader_wrapper').hide();
    DOM.$gitter.append(gitter_content);
  }
}());
communityModule.init();
