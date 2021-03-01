export interface AddrBook {
  address: string;
  name: string;
  tel: string;
  unit: string;
  buzz_code: string;
  is_default: number;
}

export interface ExistedAddrBook extends AddrBook {
  id: number;
  cid: number;
}

export function getNewExistedAddrBook(): ExistedAddrBook {
  return {
    id: 0,
    cid: 0,
    address: '',
    name: '',
    tel: '',
    unit: '',
    buzz_code: '',
    is_default: 0
  }
}
