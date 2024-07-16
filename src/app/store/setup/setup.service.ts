import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { CompetitorSuggestedModel, StateModel } from './interfaces/competitors';
import { Subject, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompetitorSetupModel {
  data: CompetitorSuggestedModel[];
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class SetupStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);

  private setup = signal<CompetitorSetupModel>({
    data: [],
    state: 'loading',
  });

  state = computed(() => this.setup().state);
  competitors = computed(() => this.setup().data);

  private state$ = new Subject<StateModel>();
  private set$ = new Subject<CompetitorSuggestedModel[]>();

  constructor() {
    connect(this.setup)
      .with(this.state$, (store, state) => ({ ...store, state }))
      .with(this.set$, (store, data) => ({ ...store, data }));
  }

  retrive() {
    this.state$.next('loading');

    of([
      {
        name: 'Pizzeria Osteria Barone',
        address_components: [
          {
            long_name: '165',
            short_name: '165',
            types: ['street_number'],
          },
          {
            long_name: 'Via Terracina',
            short_name: 'Via Terracina',
            types: ['route'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['locality', 'political'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['administrative_area_level_3', 'political'],
          },
          {
            long_name: 'Città Metropolitana di Napoli',
            short_name: 'NA',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Campania',
            short_name: 'Campania',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Italy',
            short_name: 'IT',
            types: ['country', 'political'],
          },
          {
            long_name: '80125',
            short_name: '80125',
            types: ['postal_code'],
          },
        ],
        phone: '081 762 8250',
        website: 'https://www.instagram.com/pizzeriaosteriabarone?igsh=MTM0azMxMHh1eTd3Zg==',
        url: 'https://maps.google.com/?cid=1289282065133948605',
        photos: [
          {
            height: 810,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/110017356255845875437">Pizzeria Osteria Barone</a>',
            ],
            photo_reference:
              'AUc7tXVl9_OJCF0kS6NU2Q9kxmlp5pqMUOwYSU978QF3stTYW7JL2Em3_OUU2olfPXMn145wprdk7Sq1PRgx6IUChtKK42kK3UHSeNXWjg_cUrCMpI4YVcyWvJhL76NAfzy9Q4sMxPY-FfRrn885QHS9ho1KA8kTD35zbxA2UDHmIczHq6X6',
            width: 1440,
          },
          {
            height: 2316,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/110017356255845875437">Pizzeria Osteria Barone</a>',
            ],
            photo_reference:
              'AUc7tXURSynm5xd5p9EaQLudtokEyLWTddJCJ4yCEaX_3pHJhLu6P-YvZ8c966vITmYTJkrQAg4LIATposxK4Vif_OMRPPqzf-kzmIpTQJNE7tRhX3OU_SQPJJbiQF_P4yQH8G-otCivf58abObLkHH_wjaKOHfr_2bJCTtQ6wGLLQFZyif8',
            width: 1080,
          },
          {
            height: 3000,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/114228509030103371655">Lucia D&#39;Agostino</a>',
            ],
            photo_reference:
              'AUc7tXVCSJp0wHkGPE5iKGcUtwTc5nUajJ4z8kCQl1iL8iXCSKhI5d-CFwvhRDYplUz3sjU-7XrPvM22ItPpptZhmW-x3k4Zj0k3jeCGFS_C0DnuxskIGs7T9DLRa1YI-epdfoghPj2Wv4dMMaFGbFGpJH6C0BIXNINdRF6s09g4J6lOpkw5',
            width: 4000,
          },
          {
            height: 3456,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/111016035675002452996">Gennaro Giovatore</a>',
            ],
            photo_reference:
              'AUc7tXV35HNgcnk0BvVmYopi7-OSKOewaxAXrG3OvoY4JpeogEj-Vm4LlId2Yj3heWO7GGVq4pMcYsD0Pr-oFr6ffrrenHz-mfLP7aaQjxDFXy0DMga7uoMA6wPbO-IZVeio4S4XaWrCNKsGtDGFka3fN8Vx1RvSiQlLDp1BdCnGkgGEnG4-',
            width: 3456,
          },
          {
            height: 2464,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/114228509030103371655">Lucia D&#39;Agostino</a>',
            ],
            photo_reference:
              'AUc7tXXouMMIg77zVL9icTFKJivgT0_n1mA1hnSahARJjrXLYgBgeQz5kJImI5qUHreopv4k-TXgp3XtTemc1T_9j7AkDZi6f9fkT6PZlozoF8mG46IApuR6Efz7GxlJCIofmCT4G-EcpyrmsSSOCNB_WJFk6IYfpKGHcgDrjUsLu3NLWPiE',
            width: 3280,
          },
          {
            height: 3072,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/118179321132607949644">Damiano Pauciullo</a>',
            ],
            photo_reference:
              'AUc7tXXmjGoSK3yb6_Y0xDpjP5fpnur2ZIwzXE1J_AMpoiMCowaepaPxLKw3rmMvcxzOqRIxC1GFWjQNhWfdxii9iM_TCrqLtIvIYEm-OT23SsUnvomjVNEEDAvHeA4k077cvq3Hv3TWc9ARWtoxsh7_mt4MWPETH0fsMxPyHXKJt4Tkfufw',
            width: 4096,
          },
          {
            height: 4096,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/107800310404680223035">Giovanni Guarino</a>',
            ],
            photo_reference:
              'AUc7tXUAhyAEOhfAbj5IxvHjh2RZeqlzFZYxeylDio0PmsfqiX7ppT-wnJXCw5J9S-RszCbhlD5gxhIGzI8dtl4m0rP4Cbe3c2KZHYpPfhU24_TcMEqulFd8ctZ9aYCBWxqA8sHjTyypXAj-krYI_NZkp8XR3F95BxRv0QdB3o3aEWZ5mEIg',
            width: 3072,
          },
          {
            height: 3024,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/117761490390863144915">paolo marinacci</a>',
            ],
            photo_reference:
              'AUc7tXVUyk4G0SrH6dKcXj0HgVJzywDQ8Xu2TG3yF1UteUZ_lsbt0airaiRyF6rjMMvuob6IwwWNWMOQ6_yjF4l23FMdGcgfFnf9q-YdmHeiSgTAfUyOkP1UQyuwIKMklxWS3n6JZZtw-WUbh5B4fY1Lpzki7Y9pprtPI5IqVHvgYK40ORUR',
            width: 4032,
          },
          {
            height: 4344,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/108619534921545524767">Domenico Perazzo</a>',
            ],
            photo_reference:
              'AUc7tXUR7Vy2vTrp30vVfR_273LSP4ipE_YpfY_Zwz-ixVGUnFRn6WOY6DILesxetDSHG0N96oXu_yvV_BJbwqKP89pj7206GJ_howK4AUfI4zk2C_dBx1N9Xa8THuisyvv0hs7OZ0pJbzCVkl2v6pCUHCoIDOh8AE_dzcbM_ee6BTyWJIlu',
            width: 4344,
          },
          {
            height: 2592,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/111894119185662909433">Walter Mangiarotti</a>',
            ],
            photo_reference:
              'AUc7tXVAPXBN3IbZmA02Cry9nJATCSrhvuKJZPOAi0kwZNbgKCclKgd0Tl1cFfvoAZqCx45OKMaRlEuwFeIP-nShhKJvdlBC2dp79Z__Irg9N3Bz2U5OUkF_PvwuLtt3QFrJDz_3bmU8AJGwtRwia_1QSzDbwceEuYjxrMvoaDvr7Dg8VAp3',
            width: 5760,
          },
        ],
        place_id: 'ChIJlT4jHcYOOxMRvU6XEzVz5BE',
        geometry: {
          location: {
            lat: 40.8260078,
            lng: 14.1808187,
          },
          viewport: {
            northeast: {
              lat: 40.8273041302915,
              lng: 14.1822223302915,
            },
            southwest: {
              lat: 40.8246061697085,
              lng: 14.1795243697085,
            },
          },
        },
      },
      {
        name: 'Pizzeria Di Napoli',
        address_components: [
          {
            long_name: '31',
            short_name: '31',
            types: ['street_number'],
          },
          {
            long_name: "Via Marc'Antonio",
            short_name: "Via Marc'Antonio",
            types: ['route'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['locality', 'political'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['administrative_area_level_3', 'political'],
          },
          {
            long_name: 'Città Metropolitana di Napoli',
            short_name: 'NA',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Campania',
            short_name: 'Campania',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Italy',
            short_name: 'IT',
            types: ['country', 'political'],
          },
          {
            long_name: '80125',
            short_name: '80125',
            types: ['postal_code'],
          },
        ],
        phone: '081 239 6942',
        website: 'http://www.pizzeriadinapoli.it/',
        url: 'https://maps.google.com/?cid=4678333983761032982',
        photos: [
          {
            height: 2268,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/115831042503175518735">Lorenzo Lombardi</a>',
            ],
            photo_reference:
              'AUc7tXVeLYsDWMwrNAxu3B95-XrJlABt3liqLuDF5AFbPerd8_3kEc-siIjLdxdn6zBbWRF7Ke4FNShet2-1E1hWFYhrDTmGjdkcFfpuNW5MoZ7Dar7xnGPmk4kUCl_5_N3O8vH_G_n7H5H8H43Qei8xrfszbmwPh7jUq3JLLVt2UMID9fBY',
            width: 4032,
          },
          {
            height: 3024,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/101386498234408956569">Pizzeria di Napoli</a>',
            ],
            photo_reference:
              'AUc7tXWgIy2g1AwfV8CuSCG2uMiNFT3luDsLfGDyzncdxBdRuNFVtgWEiX7ZsS2pgqZuomstEDf0ywsB-ebCZRRyH1eQKx8pialM3UYpccCpNUM63fEC84jm60S1_VJ0krN_4QPjIOnrStLcxk9bAtgzjVIcyjCcgVrFDqHBE9rMY_A03dtW',
            width: 3025,
          },
          {
            height: 1444,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/103245622088575659789">Giorgio Caruso</a>',
            ],
            photo_reference:
              'AUc7tXUuw1ucl1V22jUTu-eLuZGEnkX3rpx6_cimLs7v3ODLybb132tnNP06Zes_B6qzI8sVe2logLwXmI-YVMkrDDSdc1cbvGDC6TBHB6P6baPDDrJo5TgI3XEYMf90qpqknYer4XRXpRu_D9rAsCwojJgEhWw4h200FbAhx_UskawAGCAp',
            width: 1800,
          },
          {
            height: 465,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/101386498234408956569">Pizzeria di Napoli</a>',
            ],
            photo_reference:
              'AUc7tXVhLJeSzaOyMBSvzo_zaVVcm-GDtOwBGsBcT1GiZa9eeQSYpy_RIf-tlhdXdC9gPuqWBCYtkFhv_KEgTlHwhZ9wiDwwEOZAcwYokuHFo6e4HNf-J6C575tPfBguKyfx3YsMP1YPL1tJFoiMlKgSeWnCWTT4ATzrZSeBUne5I8yQ8vps',
            width: 824,
          },
          {
            height: 4032,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/101386498234408956569">Pizzeria di Napoli</a>',
            ],
            photo_reference:
              'AUc7tXVf6lRfFb0UZLpPN7ZuqaToGXsOIkMCnlgGfsvqSopMm9pL3RPJUUvo5pOf1jt5JKjnnpJ7RdGDKTTNeoT2zmHDTMJjF7SrxPCC7RgVw7hGYAuhIs09kBefPIoIni0F9iW9eHmg2Ccjct0RvByyfHpiUi4m6FTYkAxLks1cH1P7kcAO',
            width: 3024,
          },
          {
            height: 2736,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/108579469959072908807">Francesco Russo</a>',
            ],
            photo_reference:
              'AUc7tXWX4i7tr9CH7d7WKwfnYHWh12V7dDTD5YRCofdQAI6F93qJMhVm75pNaX-3kSyD4QOB8tGE8uUeb8fLYUQU63Cos1I7HegRswMGy6SPoDyxwXclD8GGIXMx_TCReVTD2NNII00NQY9N_OmXq9fbBm5PYeu5PcAKJLDmu9OFBpnUSFk7',
            width: 3648,
          },
          {
            height: 4032,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/103246563585316490489">Andrea Arnone</a>',
            ],
            photo_reference:
              'AUc7tXUU4EGpL7yTYY1J0OJBBdL0V-Hsp0PW12lk4h3iHSAp7x37PSujrWn4jPvj5aSDrAKHAnXG-8jTWE2Dy_DLNrG_N-eq7oI3BDZ1TY77oLrVcukRzQw35PJFHvh_kM0_09e0Dtf2kymRfchv1qhFzSrJCZIJXNovunSms6ZV2ohQxRZD',
            width: 3024,
          },
          {
            height: 4000,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/107726141908917825018">Claudio Guida</a>',
            ],
            photo_reference:
              'AUc7tXVb-z534kIWUxBFkMrdv8_54B25EKrYECwwHYw6lSxwnF5X2t44nNwvEyyWo_XOEp5vSnafOl6_q6XDLWFYFyzaotj24GSTFwVsqJqwFqbbCnwkka5bbNGIhzbfHayRxYmkYAQKv7P3lWYsSBKK34LMpefbjwlslYdMDJbmwdQbIfgv',
            width: 2992,
          },
          {
            height: 4032,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/102715843165573412798">J O</a>'],
            photo_reference:
              'AUc7tXUrdG7wkN6knqlQtZspmcGEGIT2GzSh8VFKirvqC8O-TGkpiXPuOk0nP4y1qQGZKTeAoQ_mKF73cYLEI0DFDnELddK5Fp5Ki-AUc4Fb8FhGkkvNirf6wGZXEeHmvBfzYBh27kO2Xt4crdnAAbNCxjFNopmAjtZkbeqpTTw7AwaE6M6L',
            width: 3024,
          },
          {
            height: 3904,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/102011371397086340883">fla gio</a>'],
            photo_reference:
              'AUc7tXVbg_bPM5WCd6kHNtOw27tm5jppPVaRkD2WFYKNE5tBz4ZIsCa2bI2x8dCbZSfJWUmYjTKI0E214qfMxOIhMHQFRN7XekgLlto2l7ZhehQzY16cJWR6bBfwu-YvnYB-l5JiYgjsgtRghh3nQxdk-JzAAt2QQ1IrcOQeuBRzEGjyrdEp',
            width: 2928,
          },
        ],
        place_id: 'ChIJt-bs8jAJOxMRFue2qvjH7EA',
        geometry: {
          location: {
            lat: 40.826106,
            lng: 14.2030643,
          },
          viewport: {
            northeast: {
              lat: 40.82746158029151,
              lng: 14.2044626302915,
            },
            southwest: {
              lat: 40.82476361970851,
              lng: 14.2017646697085,
            },
          },
        },
      },
      {
        name: 'Bella Figliola Napoli - Pizzerie di Fuorigrotta - Pizzeria Bella Figliola Napoli',
        address_components: [
          {
            long_name: '270',
            short_name: '270',
            types: ['street_number'],
          },
          {
            long_name: 'Via Diocleziano',
            short_name: 'Via Diocleziano',
            types: ['route'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['locality', 'political'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['administrative_area_level_3', 'political'],
          },
          {
            long_name: 'Città Metropolitana di Napoli',
            short_name: 'NA',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Campania',
            short_name: 'Campania',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Italy',
            short_name: 'IT',
            types: ['country', 'political'],
          },
          {
            long_name: '80125',
            short_name: '80125',
            types: ['postal_code'],
          },
        ],
        phone: '081 570 4093',
        website: 'https://www.bellafigliola.com/',
        url: 'https://maps.google.com/?cid=11293575729552157137',
        photos: [
          {
            height: 3024,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/106610760208681425512">bill roberts</a>',
            ],
            photo_reference:
              'AUc7tXVxTzhnWIo5rgMxiqB6sItR8rcR-ogWfS9ucENZLbz8j1vGF323ROVUcMM1usOh2y_vR9oXRUpUnp86qpnffl4UY6NSnNSKIB4EoFuE9bP4Q8pN8H7waWs9eOZVgUdB-Qf1W5BqEaJjKGLHjAzSvaBHYsiVU4Tm16JZYL0W5cXt_e0M',
            width: 4032,
          },
          {
            height: 922,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/110419164434405180550">Bella Figliola Napoli - Pizzerie di Fuorigrotta - Pizzeria Bella Figliola Napoli</a>',
            ],
            photo_reference:
              'AUc7tXVJPpRq0w_H3vGFcyNyVk53k7V3qH_DmuSlNKLeo4wBeESkm5QbROOs7ISZLAHSAesKTo2YgGUeorRju4StjTwRWKF5oTlAjl_BBref7eTrlw_xerhzY1DUsVRzJC7_vdJXyOZuyHUJi7U_4RbH_O0YZvcwSXmcruASPQjARChx8TUc',
            width: 1640,
          },
          {
            height: 800,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/110419164434405180550">Bella Figliola Napoli - Pizzerie di Fuorigrotta - Pizzeria Bella Figliola Napoli</a>',
            ],
            photo_reference:
              'AUc7tXWvAdrrCRAjD_0K3c_czwNMP2KsAy0UmdIFWCa6a5SO962qIav2cJywzrIEaTHtJsnfHwh0YJdDW3jCIQaDGbvXOlJGxoaZMGZsdmtT9mzcfLOrG1_h3x62nu4ombeNqTh9InRCaHUQ4SchhR-nIJu8iueYLpPL-i9-vRaaL1NcePgP',
            width: 800,
          },
          {
            height: 1000,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/110419164434405180550">Bella Figliola Napoli - Pizzerie di Fuorigrotta - Pizzeria Bella Figliola Napoli</a>',
            ],
            photo_reference:
              'AUc7tXUjPsrKZsiOcGvkqoH60x1lNiRY1hRmDcxrMURtUarPIv652eU-TfJsDQTPlH1kD35drflfzey6BrKniaOOPA-K1H_NagIKVuS18iI-rE8I_lq6GSWgphcUOjcIXOSXTrrB2ze4Es7uE7_4Ta1Q1z4CPJNUmiXEoNEvEurJLoA59j-d',
            width: 1000,
          },
          {
            height: 3120,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/100648048615989751042">J N</a>'],
            photo_reference:
              'AUc7tXXbzKmdmxiB_cJuwg1xR0RMKD7xQSTYf4ztyYX6aeL893gy4X3ioD0Pvy23OJ1aM_q5UAbMX3IeIpaM17vK4JmOndJStG05FJdqrS8RppME2f-D1tlmfbkE6SWniWWReRTXci8JOFhN6SeP0LhfF_I-XPHOLDIDPWIZA8f2T_BN_Jdo',
            width: 4160,
          },
          {
            height: 3000,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/113075164215297181680">Francesco Montuori</a>',
            ],
            photo_reference:
              'AUc7tXVLh-M5yqZhkqruTF11uPmlcVecUXK0Km0YKmgK9CvluUWD_K9j8AjPWOjmH7FVc8NVL4E5jvotCcT_3ANPXizKq87GVrGR-UqdVAYSSKYbkYItEQUMarNeR0WGfNHWvgrnMFKvZL7naqCqvzPuk2hwjoYwS5hToMmPMXdh7MWyVro',
            width: 4000,
          },
          {
            height: 800,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/110419164434405180550">Bella Figliola Napoli - Pizzerie di Fuorigrotta - Pizzeria Bella Figliola Napoli</a>',
            ],
            photo_reference:
              'AUc7tXVMXZBVehCQs9eqKy4utwkC6Kc-tCjlYLXg31IuDaO-5hb05xCgvkdUv4UfpyAVghJImB4yaSlNxOJVIkrEeXJaA6j40sCgVD7YTauRHY-OjfVBjfi0V98Hnx49OPbdjLLRlUWolPT1s6S6n59pdkD--NeWSSTReancbqAALB4d_uKa',
            width: 800,
          },
          {
            height: 4032,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/114160883727346906318">Genn Bor</a>'],
            photo_reference:
              'AUc7tXVX99YxfWvVeSgVPH1Z0uoFHd3B_uMKJJXdOA-HJapzWqY1WPWrwUowqcLaUB29Cq65JSIK3mElP9llPvDrWOnkdHMBnsPv63T8HOnQ_uagejnJ7cetilgSn3_IOtQM4rhAWxPLDB9hBOranV5QDIh4-NdNVJPNp-teRsvTca8jkj2H',
            width: 3024,
          },
          {
            height: 800,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/110419164434405180550">Bella Figliola Napoli - Pizzerie di Fuorigrotta - Pizzeria Bella Figliola Napoli</a>',
            ],
            photo_reference:
              'AUc7tXVMPPPxaRTbgixrSC1DJPFEAYGVJxErR_u0_hwMcT9vjNLSuncufl8xeOAzfSgZtvfqviIVtASc-q5HFEnrpRNvyYk-AZ9Y3ARPU3Fc46r9FkkLGyzh7jZHCdvXmnPJyDlFxUcn1iriwPK1L2GQGqyCOCV1RHKxEBDasaQ_WRW-r0dB',
            width: 800,
          },
          {
            height: 3120,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/100648048615989751042">J N</a>'],
            photo_reference:
              'AUc7tXXgyLfvOlSflvF2ndXbshIUdC00lYLWLaJx5B62ZxMQGRA1q3PaAnHhFmpKsleNrrgrCVGGP8HdxXmiV8OBbSl9ni8PpG3Z75clWHq6o2ppv9wfPFmRicY49wLTtyMs_nL9hmEfAqXCD9rL2wtMwK0M6Np0un_vGKaoNnKOjw6sgglf',
            width: 4160,
          },
        ],
        place_id: 'ChIJQeteOLYOOxMR0entQ0rXupw',
        geometry: {
          location: {
            lat: 40.8202277,
            lng: 14.1852855,
          },
          viewport: {
            northeast: {
              lat: 40.82152803029149,
              lng: 14.1866572802915,
            },
            southwest: {
              lat: 40.8188300697085,
              lng: 14.1839593197085,
            },
          },
        },
      },
      {
        name: 'Pizzaioli Veraci Fuorigrotta',
        address_components: [
          {
            long_name: '68',
            short_name: '68',
            types: ['street_number'],
          },
          {
            long_name: 'Viale di Augusto',
            short_name: 'Viale di Augusto',
            types: ['route'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['locality', 'political'],
          },
          {
            long_name: 'Napoli',
            short_name: 'Napoli',
            types: ['administrative_area_level_3', 'political'],
          },
          {
            long_name: 'Città Metropolitana di Napoli',
            short_name: 'NA',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'Campania',
            short_name: 'Campania',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Italy',
            short_name: 'IT',
            types: ['country', 'political'],
          },
          {
            long_name: '80125',
            short_name: '80125',
            types: ['postal_code'],
          },
        ],
        phone: '081 628718',
        website: 'https://www.pizzaioliveraci.it/',
        url: 'https://maps.google.com/?cid=12590510045558087826',
        photos: [
          {
            height: 3024,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/100765868429630656204">Alfredo Amodio</a>',
            ],
            photo_reference:
              'AUc7tXXxOC_6rDCC2Qp6_rWFcbOGjErYShGHcyDyXrqdWMQRcfFjFyha7XTGT2x-zG0_IdqYmfYW2ORcNTaflCp_QrkKyoXNxggjyv2EbLS1EPkkyUSAm2WQXVI9KeVswFAj6euTbUrzrcji41GOSvvkByrVDqZjku5ADaIJL8hzD7VB6qq8',
            width: 4032,
          },
          {
            height: 1241,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/100072319604681236177">Pizzaioli Veraci Fuorigrotta</a>',
            ],
            photo_reference:
              'AUc7tXXRElw2UM7bfG9k2r74cMl8BnmleU3UWV6y5uGhrTihof850IhhCIakpUwZw42gAwehhai1ewVz9H7h6wxBR25sAT2S2DzpkyMVilRmdWN1SAirCXCM8XZxfrNg3-3ynm4VxKiLMHC3ytvgqH8zcm62CRLLY2OUmLMVWNL9PDXCokhE',
            width: 1241,
          },
          {
            height: 4032,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/102181635000127195463">Linda Hrdlickova</a>',
            ],
            photo_reference:
              'AUc7tXUxDDOQTMWgRCwB3TJfyM9c3Bdj4wvc8u5nidE0QHN5U-M4CdflBCb8DmtLaR0qo0_8OGO61Pw_duKu8Ga8R1wLc7lEz2Ydpr7g5sG0AzL-TrCMltZPtJqjIStcV9d-CQdCSV3wnG0qNjmjZobc_S-ji_DEe9Y7cRsA87daSN3ZPvfQ',
            width: 3024,
          },
          {
            height: 12000,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/102918910136602205762">DANILO</a>'],
            photo_reference:
              'AUc7tXUYkjFbtuoWabgl-NdUi2Kkog4hfT0g9rnQxHSPmXEIMnEnbkNfcx9rYRnC5pcatCt1HPf9zETT5mAS9mgKtydREv76f2Y6sml0cE74rWbyzQ6vhld0QI5ixpuJOf3GY6L6KkLqUgjBnsmFR-6SqSm4X_BexOxPSdIIfJV2WsrXZbOI',
            width: 9000,
          },
          {
            height: 4000,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/117758006583074264662">Blackeye</a>'],
            photo_reference:
              'AUc7tXVOc5AFWIfjcQHCvPis_hD_FwhUgkH5CRcVIAbxDiBW-Z_M6ePPepMXHlruj-n_QAbuaIeuNbsKzsar14c_cvtjuc_WefG-XVexuV-qqgQpN-4Yja6InmXPPWZYdFR93fvFAhiNIqaTplghXG9ekxDEsXb5J5xO0_jMyMsAqzHIQ7lj',
            width: 3000,
          },
          {
            height: 2992,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/108638522337762184530">Rino Figliuolo</a>',
            ],
            photo_reference:
              'AUc7tXWmWfzx_FU4MGpM3eAlNM_fUOAGw168z3iZleYoUTTq_q1R8IXyWORnMDoNN-ClWLgnILbAgt7hCyf997yg-S90Hf4BE91gpxsggSWf9vddvchHUAVWh6Vh1q9g1H5IgBASgM3ti_qYue2LcVWARK9BvpE92uSkI2cti5xK5G9ooZBq',
            width: 2992,
          },
          {
            height: 4096,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/115892828316122697188">Antonio Peluso</a>',
            ],
            photo_reference:
              'AUc7tXXSxIBp2beGpOaPr46sP23WO5T1FPsUaanngmcIqVzzWBwMHAKIT4U2-DfTlxqa5P4Jaw4zw9hnfLmXm4OqegW4wWx4N3IUIq3Kjso6il9vHU1x2abL0KVQGJjr_u9BEy_0oBetEeQWaNpigHo-pZTcOgNIXfSuMJ0gJqUI5G7MzYf7',
            width: 3072,
          },
          {
            height: 3472,
            html_attributions: ['<a href="https://maps.google.com/maps/contrib/103932340379179204726">Mario Cond.</a>'],
            photo_reference:
              'AUc7tXUHBaaL-b-CJNtsEfXAGzpIjpSWIz3BoMai0QMZIJyzqjH7V5TNdC-8sLkyrWDug-o3tg5kh9dJdDEeBGDjAtk3zFjLz_Mgg_ZowSDvRg69lPvsUZBNTmZ7-gOblObSC_jTMWvQIpBlXsOycFQ2SahWvos3ujNyjmQgzwMnuZ9zbQPe',
            width: 4624,
          },
          {
            height: 3456,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/102097476735915585807">harshit singh</a>',
            ],
            photo_reference:
              'AUc7tXX9m2vJSnukxs1jKpxdobMZh6VEld7poCXSnuUEODLjKVaPVUHb9mCWkjJLwykH20918KoRPfeK-nP5lRun9pzI3BpBn6aOI3mUV-PHADUVxhx0ERqkNnt6nYTdgnsSM730WQFjSqSjpZViRFnxCyxqXzlHmHCd-ZFq44x3k-YEAIyN',
            width: 4608,
          },
          {
            height: 4032,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/105103628587385316399">Luigi “Luigg”</a>',
            ],
            photo_reference:
              'AUc7tXUBsRj3mQpkOMdeXwUGO8RNRN4mNHtQU7TqhcQjLmjCzXNI-o5JO2-Ff_F8-qFXZRCNyal_BOOww2bqTsLDD-7YfDr0r20-r8WTuQhcae9xsfqs_MhQV1Jq7ISZTRW0CFOJYWlBv6qIM8bJGxa6eW57h2GRlNghE5sy980ic1oNM9Wn',
            width: 3024,
          },
        ],
        place_id: 'ChIJo6JHcjEJOxMRkiB61i16uq4',
        geometry: {
          location: {
            lat: 40.8264573,
            lng: 14.2000522,
          },
          viewport: {
            northeast: {
              lat: 40.8277466802915,
              lng: 14.2014041302915,
            },
            southwest: {
              lat: 40.8250487197085,
              lng: 14.1987061697085,
            },
          },
        },
      },
    ] as CompetitorSuggestedModel[])
      .pipe(
        tap((data) => {
          console.log(data);
          this.set$.next(data as CompetitorSuggestedModel[]);
          this.state$.next('loaded');
        }),
        catchError((error) => {
          this.state$.next('error');
          return of(error);
        })
      )
      .subscribe();

    // this.http
    //   .get<CompetitorSuggestedModel[]>(`${environment.apiUrl}/api/restaurants/competitors/retrieve`)
    //   .pipe(
    //     untilDestroyed(this),
    //     tap((data) => {
    //       console.log(data);
    //       this.set$.next(data as CompetitorSuggestedModel[]);
    //       this.state$.next('loaded');
    //     }),
    //     catchError((error) => {
    //       this.state$.next('error');
    //       return of(error);
    //     })
    //   )
    //   .subscribe();
  }
}
