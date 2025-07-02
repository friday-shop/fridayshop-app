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
  phone: string;
  bankNumber: string;
  bankProvider: string;
}
