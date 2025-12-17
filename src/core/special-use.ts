export type SpecialUseFlag =
  | '\\All'
  | '\\Archive'
  | '\\Drafts'
  | '\\Flagged'
  | '\\Junk'
  | '\\Sent'
  | '\\Trash'
  | '\\Inbox'

export const SPECIAL_USE_FLAGS: SpecialUseFlag[] = [
  '\\All',
  '\\Archive',
  '\\Drafts',
  '\\Flagged',
  '\\Junk',
  '\\Sent',
  '\\Trash',
]

const SPECIAL_USE_NAMES: Record<string, readonly string[]> = {
  '\\Archive': ['archive'],
  '\\Drafts': [
    'ba brouillon',
    'borrador',
    'borradores',
    'bozze',
    'brouillons',
    'bản thảo',
    'ciorne',
    'concepten',
    'draf',
    'draft',
    'drafts',
    'drög',
    'entwürfe',
    'esborranys',
    'garalamalar',
    'juodraščiai',
    'kladd',
    'kladder',
    'koncepty',
    'konsep',
    'konsepte',
    'kopie robocze',
    'layihələr',
    'luonnokset',
    'melnraksti',
    'mustandid',
    'nacrti',
    'osnutki',
    'piszkozatok',
    'rascunhos',
    'rasimu',
    'skice',
    'taslaklar',
    'utkast',
    'vázlatok',
    'черновики',
    'чернетки',
    'טיוטות',
    'مسودات',
    'پیش نویسها',
    'ड्राफ़्ट',
    'খসড়া',
    'ฉบับร่าง',
    '下書き',
    '草稿',
    '임시 보관함',
  ],
  '\\Junk': [
    'bulk mail',
    'correo no deseado',
    'courrier indésirable',
    'istenmeyen',
    'istenmeyen e-posta',
    'junk',
    'junk e-mail',
    'junk email',
    'junk-e-mail',
    'levélszemét',
    'nevyžádaná pošta',
    'no deseado',
    'posta indesiderata',
    'pourriel',
    'roskaposti',
    'rämpspost',
    'skräppost',
    'spam',
    'spamowanie',
    'søppelpost',
    'thư rác',
    'wiadomości-śmieci',
    'спам',
    'דואר זבל',
    'الرسائل العشوائية',
    'هرزنامه',
    'สแปม',
    '垃圾郵件',
    '垃圾邮件',
  ],
  '\\Sent': [
    'elementos enviados',
    'éléments envoyés',
    'enviadas',
    'enviados',
    'envoyés',
    'gesendete',
    'gesendete elemente',
    'gönderilmiş öğeler',
    'inviati',
    'išsiųstieji',
    'lähetetyt',
    'messages envoyés',
    'nosūtītās ziņas',
    'odeslaná pošta',
    'odeslané',
    'poslané',
    'poslano',
    'saadetud',
    'saadetud kirjad',
    'sendt',
    'sent',
    'sent items',
    'sent messages',
    'sända poster',
    'sänt',
    'terkirim',
    'të dërguara',
    'verzonden',
    'wysłane',
    'đã gửi',
    'σταλθέντα',
    'изпратени',
    'испратено',
    'надіслані',
    'отправленные',
    'юборилган',
    'נשלחו',
    'المرسلة',
    'موارد ارسال شده',
    'पाठविले',
    'प्रेषित',
    'ส่งแล้ว',
    '寄件備份',
    '已发信息',
    '送信済みﾒｰﾙ',
    '보낸 편지함',
  ],
  '\\Trash': [
    'bin',
    'borttagna objekt',
    'deleted',
    'deleted items',
    'deleted messages',
    'elementi eliminati',
    'elementos borrados',
    'elementos eliminados',
    'gelöschte objekte',
    'gelöschte elemente',
    'item dipadam',
    'itens apagados',
    'itens excluídos',
    'kustutatud üksused',
    'mục đã xóa',
    'odstraněná pošta',
    'odstraněné položky',
    'pesan terhapus',
    'poistetut',
    'praht',
    'prügikast',
    'silinmiş öğeler',
    'slettede beskeder',
    'slettede elementer',
    'trash',
    'törölt',
    'törölt elemek',
    'usunięte wiadomości',
    'verwijderde items',
    'vymazané správy',
    'éléments supprimés',
    'видалені',
    'удаленные',
    'פריטים שנמחקו',
    'العناصر المحذوفة',
    'موارد حذف شده',
    'รายการที่ลบ',
    '已删除邮件',
    '已刪除項目',
  ],
}

export type SpecialUseResult = {
  readonly flag: SpecialUseFlag | null
  readonly source?: 'extension' | 'name'
}

export const detectSpecialUse = (
  hasSpecialUseExtension: boolean,
  folder: { flags: ReadonlySet<string>; name: string },
): SpecialUseResult => {
  if (hasSpecialUseExtension) {
    const flag = SPECIAL_USE_FLAGS.find(x => folder.flags.has(x))

    if (flag) {
      return { flag, source: 'extension' }
    }
  }

  const name = folder.name
    .toLowerCase()
    .replace(/\u200e/g, '')
    .trim()

  for (const [flag, names] of Object.entries(SPECIAL_USE_NAMES)) {
    if (names.includes(name)) {
      return { flag: flag as SpecialUseFlag, source: 'name' }
    }
  }

  return { flag: null }
}
