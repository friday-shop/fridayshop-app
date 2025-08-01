export interface IPaymentAccount {
  /** ชื่อร้าน */
  shopName: string;
  /** ชื่อแพ็กเกจปัจจุบัน */
  package: string;
  /** วันหมดอายุแพ็กเกจ (ISO 8601) */
  packageExpiredDate: string;
  /** จำนวนโควต้าทั้งหมดของแพ็กเกจ */
  quotaLimit: number;
  /** โควต้าคงเหลือ */
  quotaRemaining: number;
  /** เครดิตคงเหลือ */
  creditRemaining: number;
  /** ตั้งค่าต่ออายุแพ็กเกจอัตโนมัติ */
  autoRenewalPackage: boolean;
  /** ตั้งค่าตรวจสลิปผ่านเครดิต */
  checkSlipByCredit: boolean;
}

export interface IPayment {
  accessToken: string;
  name: string;
  engName: string;
  phone: string;
  bankNumber: string;
  bankCode: string;
}

export const BANKS = {
  '002': 'ธนาคารกรุงเทพ',
  '004': 'ธนาคารกสิกรไทย',
  '006': 'ธนาคารกรุงไทย',
  '011': 'ธนาคารทหารไทยธนชาต (ทีทีบี)',
  '014': 'ธนาคารไทยพาณิชย์',
  '017': 'ธนาคารซิตี้แบงก์',
  '018': 'ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น',
  '020': 'ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)',
  '022': 'ธนาคารซีไอเอ็มบี ไทย',
  '024': 'ธนาคารยูโอบี (ไทย)',
  '025': 'ธนาคารกรุงศรีอยุธยา',
  '026': 'ธนาคารเมกะ สากลพาณิชย์',
  '030': 'ธนาคารออมสิน',
  '033': 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
  '034': 'ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย',
  '066': 'ธนาคารอิสลามแห่งประเทศไทย',
  '069': 'ธนาคารแลนด์ แอนด์ เฮ้าส์',
  '070': 'ธนาคารไอซีบีซี (ไทย)',
  '071': 'ธนาคารไทยเครดิต เพื่อรายย่อย',
  '073': 'ธนาคารทิสโก้',
  '074': 'ธนาคารเกียรตินาคินภัทร',
} as const;
