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

  async fetchMarkets() {
    let markets = await this.publicGetGetinstruments ();
    console.log(markets)
  }

}
