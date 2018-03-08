'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { AuthenticationError, ExchangeError, NotSupported } = require ('./base/errors');


//  ---------------------------------------------------------------------------

module.exports = class deribit extends Exchange {
  describe() {
    return this.deepExtend (super.describe (), {
      'id': 'Deribit',
      'name': 'Deribit',
      'countries': 'US',
      'rateLimit': 1000,
      'has': {
          'CORS': false,
          'fetchTickers': true,
          'fetchOrderBooks': true,
      },
      'urls': {
          'logo': 'https://user-images.githubusercontent.com/1294454/30597177-ea800172-9d5e-11e7-804c-b9d4fa9b56b0.jpg',
          'api': {
              'public': 'https://www.deribit.com/api/v1/public',
              'private': ' https://www.deribit.com/api/v1/private',
          },
          'www': 'https://www.deribit.com',
          'doc': 'https://www.deribit.com/pages/docs/',
      },
      'api': {
          'public': {
              'get': [
                  'getinstruments',
                  'index',
                  'getcurrencies',
                  'getorderbook',
                  'getlasttrades',
                  'getsummary',
                  'stats',
                  'getannouncements',
              ],
          },
          'private': {
              'post': [
                  'account',
                  'buy',
                  'sell',
                  'edit',
                  'cancel',
                  'cancelall',
                  'getopenorders',
                  'positions',
                  'orderhistory',
                  'orderstate',
                  'tradehistory',
                  'newannouncements',
              ],
          },
      },
      'fees': {
          'trading': {
              'maker': 0.02,
              'taker': 0.05,
          },
      },
    });
  }

  async getInstruments(params={}) {
    let instruments =  await this.publicGetGetinstruments (params);
    return instruments;
  }

  async getIndex (params={}) {
    let  indexs =  await this.publicGetIndex (params);
    return indexs;
  }


  async getcurrencies (params={}) {
    let curr = await this.publicGetGetcurrencies (params);
    return curr;
  }

  async getorderbook(params={}) {
    let orderBook = await this.publicGetGetorderbook (params);
    return orderBook;
  }

  async getlasttrades (params) {
    let trades = await this.publicGetGetlasttrades (params);
    return trades;
  }

  async getsummary (params={}) {
    let summary = await this.publicGetGetsummary (params);
    return summary
  }

  async getStatistics (params={}) {
    let stat = await this.publicGetStats (params);
    return stat;
  }

  sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];

        if (api === 'private') {
            this.checkRequiredCredentials ();
            let nonce = this.nonce ().toString ();
            let query = this.keysort (this.extend ({
                'a': path,
                'apikey': this.apiKey,
                'nonce': nonce,
            }, params));
            url += '?' + this.urlencode (query);
            headers = { 'apisign': this.hmac (this.encode (url), this.encode (this.secret), 'sha512') };
        } else if (api === 'public' && Object.keys(params).length > 0) {
            url += '/' + path + '?'+ this.urlencode (this.extend (params));
        } else {
            url += '/' + this.implodeParams (path, params);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

}
