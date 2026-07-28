<?php
/**
 * BU DOSYAYI public_html'in DISINA koy. Ornek: /home/KULLANICI/private/config.php
 * public_html icinde durursa birisi tarayicidan cagirabilir.
 * Eger public_html disina koyamiyorsan, ayni klasordeki .htaccess ile korunuyor (asagida).
 */

return [
    // cPanel > Manage My Databases ekranindan aldigin degerler.
    // cPanel'de veritabani ve kullanici adinin basina hesap adin otomatik eklenir:
    // ornegin "hercules_site" ve "hercules_web" gibi.
    'db_host' => 'localhost',
    'db_name' => 'KULLANICI_hercules',
    'db_user' => 'KULLANICI_web',
    'db_pass' => 'BURAYA_VERITABANI_SIFRESI',

    // Bildirim maili nereye gitsin (birden fazla olabilir)
    'notify_to' => ['info@herculesllc.net'],

    // Gonderen adresi MUTLAKA kendi alan adinda olmali, yoksa spam'e duser.
    // Bu adresi cPanel > Email Accounts'tan gercekten olustur.
    'mail_from'      => 'noreply@herculesllc.net',
    'mail_from_name' => 'Hercules Investments LLC',

    // Formun kabul edecegi origin (CORS). Kendi alan adini yaz.
    'allowed_origin' => 'https://herculesinvestmentsllc.com',

    // Ayni IP'den art arda gonderim engeli (saniye)
    'throttle_seconds' => 30,
];
