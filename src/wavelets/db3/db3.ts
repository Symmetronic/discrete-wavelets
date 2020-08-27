import { WaveletBasis } from '../wavelets';

/**
 * Daubechies 3 basis.
 */
export const Db3Wavelet: WaveletBasis = {

  dec: {
    low:  [
      3.326705529500826159985115891390056300129233992450683597084705e-01,
      8.068915093110925764944936040887134905192973949948236181650920e-01,
      4.598775021184915700951519421476167208081101774314923066433867e-01,
      -1.350110200102545886963899066993744805622198452237811919756862e-01,
      -8.544127388202666169281916918177331153619763898808662976351748e-02,
      3.522629188570953660274066471551002932775838791743161039893406e-02,
    ],
    high: [
      3.522629188570953660274066471551002932775838791743161039893406e-02,
      8.544127388202666169281916918177331153619763898808662976351748e-02,
      -1.350110200102545886963899066993744805622198452237811919756862e-01,
      -4.598775021184915700951519421476167208081101774314923066433867e-01,
      8.068915093110925764944936040887134905192973949948236181650920e-01,
      -3.326705529500826159985115891390056300129233992450683597084705e-01,
    ],
  },

  rec: {
    low:  [
      3.326705529500826159985115891390056300129233992450683597084705e-01,
      8.068915093110925764944936040887134905192973949948236181650920e-01,
      4.598775021184915700951519421476167208081101774314923066433867e-01,
      -1.350110200102545886963899066993744805622198452237811919756862e-01,
      -8.544127388202666169281916918177331153619763898808662976351748e-02,
      3.522629188570953660274066471551002932775838791743161039893406e-02,
    ],
    high: [
      3.522629188570953660274066471551002932775838791743161039893406e-02,
      8.544127388202666169281916918177331153619763898808662976351748e-02,
      -1.350110200102545886963899066993744805622198452237811919756862e-01,
      -4.598775021184915700951519421476167208081101774314923066433867e-01,
      8.068915093110925764944936040887134905192973949948236181650920e-01,
      -3.326705529500826159985115891390056300129233992450683597084705e-01,
    ],
  },
};