const { Telegraf, Markup } = require('telegraf');
const dotenv = require('dotenv');
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(Telegraf.log());

const greetedUsers = new Set();

bot.start((ctx) => {
    ctx.replyWithHTML(
        'Assalomu alaykum, <b>' + ctx.message.from.first_name + '</b> '
        + '\nPsixologik test botiga xush kelibsiz! 💌\nBu botda o\'zingiz haqingizdagi qiziqarli ma\'lumotlarga ega bo\'lasiz \nTESTni boshlashga tayyormisiz? 🏁',
        Markup.inlineKeyboard([
            Markup.button.callback('Ha albatta 😉', 'start_test')
        ])
    );
});

bot.action('start_test', (ctx) => {
    ctx.reply(
        'Testlardan birini tanlang',
        Markup.keyboard([
            ['shaxsiyat turi'],
            ['miyangizning qaysi yarim shari yaxshi rivojlangan'],
            ['fikrlash tarzingiz'],
            ["fe'l-atvoringizdagi xususiyatlar"]
        ])
            .oneTime()
            .resize()
    );
});

bot.hears('shaxsiyat turi', (ctx) => {
    ctx.replyWithPhoto({ source: 'media/koz.png' }).then(() => {
        ctx.reply(
            'Hech ikkilanmasdan o\'zingizga yoqqan rasmni tanlang...',
            Markup.inlineKeyboard([
                [Markup.button.callback('1', 'type_1'), Markup.button.callback('2', 'type_2'), Markup.button.callback('3', 'type_3')],
                [Markup.button.callback('4', 'type_4'), Markup.button.callback('5', 'type_5'), Markup.button.callback('6', 'type_6')],
                [Markup.button.callback('7', 'type_7'), Markup.button.callback('8', 'type_8'), Markup.button.callback('9', 'type_9')]
            ])
        );
    });
});

const personalityTypes = {
    type_1: "Ishonchli shaxs 🤝\nSiz deyarli har qanday odamni hayotingizga va yuragingizga kirishga imkon beradigan odamsiz. O'zingizni odamlardan yopib qo'ygandan ko'ra, tavakkal qilib, zarar ko'rgan ma'qul deb o'ylaysiz. Siz o'z qo'rquvingizni va ishonchsizligingizni hech kimga ko'rsatmaysiz. Muammolaringizni o'zingiz hal qilishingiz kerakligiga ishonasiz. Sizning Ruhingizni tirnashsa ham, siz o'zingizni odamlarga berishga harakat qilasiz. Boshqalarga yordam berish orqali siz jarohatlaringizni davolaysiz.",
    type_2: "Pedantik shaxsiyat 💪🏼\nSiz hamma narsa to'g'ri bajarilishini talab qiladigan odamsiz. Siz qilayotgan ishingiz boshqalarning hayotini o'zgartirishini tushuntirasiz. Siz odamlarga hayajoningizni va xafa bo'lganingizni ko'rsatmaysiz. Siz yaxshiroq bo'lishga harakat qilasiz.",
    type_3: "Qurbon shaxs 🖐🏼\nMumkin bo'lgan joyda tinchlikni topishga harakat qilasiz. Bu chalkash dunyoda o'z o'rningizni qidiryapsiz. Siz odamlarga qora fikrlaringizni ko'rsatmaysiz. Siz ko'p narsalarni boshdan kechirdingiz. Aytishimiz mumkin - siz yiqilgandan keyin o'zingizni yig'ishga ustasisiz.",
    type_4: "Fikrlovchi shaxs 👏🏼\nSiz hamma narsani yaxshilab o'ylab ko'rishni yaxshi ko'radigan odamsiz. Siz narsalarning chuqur va yashirin ma'nosini topishni yaxshi ko'rasiz. Siz ba'zan o'z fikrlaringizga juda sho'ng'ib ketasiz, ba'zida qaytib kelishingiz qiyin. Siz boshqalarga hamma narsaga qanchalik ishonchsiz ekanligingizni ko'rsatmaysiz. Siz, albatta, biror narsani tushunishingiz mumkin, ammo bu haqda hali ham ishonchingiz komil emas. Siz hayotni jumboq sifatida tasavvur qilasiz va barcha qismlarni birlashtirmaguningizcha qo'ymaysiz.",
    type_5: "Sirli odam 🤔\nSiz hatto o'zingiz uchun ham sirsiz... Sizni tushunishga harakat qilganlarga sabr tilaymiz. Siz qarama-qarshiliklar to'riga o'xshaysiz, kayfiyatingizni osongina o'zgartirasiz. O'zingizni topishingiz bilanoq, siz darhol o'zgarib, o'zligingizni qidirishni qayta boshlaysiz. Siz kam so'zli odamsiz va harakatlaringizda boshqalarni, ba'zan esa o'zingizni chalkashtirib yuborasiz. Siz suhbatni boshlashdan oldin odamni kuzatishni afzal ko'rasiz. Siz faqat ishonchingiz komil bo'lgan narsani aytasiz.",
    type_6: "Sezuvchan shaxs 🤒\nSiz hamma narsani sezadigan va hech narsani unutmaydigan odamsiz. Siz juda sezgirsiz va hatto eng kichik narsalar ham sizni hayratda qoldirishi mumkin. Siz osongina ko'z yosh to'kasiz yoki kulasiz. Siz naqadar mo'rt ekaningizni ko'pchilikka ko'rsatolmaysiz. Buning o'rniga, siz qanchalik aqlli bo'lishingiz mumkinligini ko'rsatasiz. Ehtimol, kelajakda hayotingizda nima bo'lishini oldindan bilishingiz mumkin.",
    type_7: "Energetik shaxsiyat ⚡\nSiz har doim kuchli energiya yoki... muhabbatda bo'lgan odamsiz. Siz juda aqllisiz. Siz uni sevasiz yoki yomon ko'rasiz. Sizda bir tonna yoki undan ko'p fikr bor ... Va siz tezda qaror qabul qilasiz. Sizda juda ko'p energiya bor, lekin siz tez-tez asabiylashasiz. Ba'zan boshingizda drama yaratmay qo'ya olmaysiz.",
    type_8: "Eksantrik shaxsiyat 😏\nSiz g'ayrioddiy qiziqishlar va e'tiqodlarga ega bo'lgan odamsiz. Qoidalarni yoqtirmaysiz. Ko'pincha shu printsipga amal qilasiz - 'Men xohlagan narsamni qilaman, nima bo'lsa bo'lsin'. Siz boshqa odamlarga ochiqsiz. Sizni o'zgartirmoqchi bo'lganlarning ustidan kulasiz. Siz odamlarga o'xshashni yoki ularning bir qismi bo'lishni yoqtirmaysiz.",
    type_9: "Intuitiv shaxsiyat🧠\nSiz dunyoni va boshqa odamlarni juda yaxshi tushunadigan odamsiz. Siz odamning yuz ifodasi yoki ovoz ohangiga qarab ko'p narsani aytishingiz mumkin. Sizni aldashayotganini his qilasiz. Siz dunyoga faqat ko'rsatmoqchi bo'lgan narsangizni ko'rsatasiz. Agar kerak bo'lsa, kimnidir boshqarishni bilasiz. Ammo, odatda bunday qilmaysiz."
};

Object.keys(personalityTypes).forEach(type => {
    bot.action(type, (ctx) => ctx.reply(personalityTypes[type]));
});

bot.hears('miyangizning qaysi yarim shari yaxshi rivojlangan', (ctx) => {
    ctx.replyWithPhoto({ source: 'media/miya.jpeg' }).then(() => {
        ctx.reply(
            "Rasmda birinchi bo'lib nimani ko'rdingiz...",
            Markup.inlineKeyboard([
                [Markup.button.callback('Yo\'lbars 🐯', 'brain_1')],
                [Markup.button.callback('Maymun 🐒', 'brain_2')]
            ])
        );
    });
});

const brain = {
    brain_1: "🔑 Sizning chap yarim sharingiz yaxshi rivojlangan \n Agar siz yo'lbarsni ko'rgan bo'lsangiz, unda sizda analitik va mantiqiy fikrlash qobiliyati bor. Sizning kuchli tomonlaringiz - qat'iyatlilik, halollik, tashkilotchilik va mustaqillik. Hayotda siz ratsionalizmni boshqarasiz va hech qachon his-tuyg'ular ta'sirida qaror qabul qilmaysiz.",
    brain_2: "🗝️ Sizning o'ng yarim sharingiz yaxshiroq rivojlangan \n Agar siz maymunni ko'rgan bo'lsangiz, unda siz ijodiy qobiliyat va boy tasavvur bilan maqtanishingiz mumkin. Siz impulsiv harakatlarga moyilsiz va ko'pincha hissiy holatingizga qarab qaror qabul qilasiz. Shu bilan birga, siz juda sezgir va xayolparast odamsiz,  taxminlar va sezgilarga tayanasiz."
};

Object.keys(brain).forEach(type => {
    bot.action(type, (ctx) => ctx.reply(brain[type]));
});

bot.hears('fikrlash tarzingiz', (ctx) => {
    ctx.replyWithPhoto({ source: 'media/qora_oq.jpg' }).then(() => {
        ctx.reply(
            "Birinchi bo'lib ko'rgan narsani tanlang...",
            Markup.inlineKeyboard([
                [Markup.button.callback('Baliqlar', 'black1'), Markup.button.callback('Qiz', 'black2'), Markup.button.callback('Yulduzli osmon', 'black3')]
            ])
        );
    });
});

const black = {
    black1: "🐠 Siz oqim bilan borishni yaxshi ko'radigan va har qanday vaziyatga osongina yechim topadigan odamsiz. Siz juda donosiz va o'z xatolaringizdan o'rganasiz. Biroq, ba'zida orzularingizga erishish uchun faolroq bo'lishingiz kerak.",
    black2: "👧🏻 Siz romantik odamsiz va do'stlaringiz va oilangiz qurshovida bo'lishni yaxshi ko'rasiz, ular ham siz bilan vaqt o'tkazishdan zavqlanishadi. Ba'zan siz soddalik qilasiz, shuning uchun qaror qabul qilishdan oldin bir necha bor o'ylab ko'rgan ma'qul.",
    black3: "🌠 Siz faylasuf va xayolparastsiz. Sizga o'xshagan odamlar inqilobni boshlashi mumkin, garchi ba'zilar sizning g'oyalaringiz aqldan ozgan deb aytishadi. Orzu qilishni to'xtatmang, lekin vaqti-vaqti bilan haqiqatga qaytishni ham unutmang."
};

Object.keys(black).forEach(type => {
    bot.action(type, (ctx) => ctx.reply(black[type]));
});

bot.hears("fe'l-atvoringizdagi xususiyatlar", (ctx) => {
    ctx.replyWithPhoto({ source: 'media/kapalak.jpg' }).then(() => {
        ctx.reply(
            "Qaysi kapalak turini tanlaysiz...",
            Markup.inlineKeyboard([
                [Markup.button.callback('1', 'but_1'), Markup.button.callback('2', 'but_2'), Markup.button.callback('3', 'but_3')],
                [Markup.button.callback('4', 'but_4'), Markup.button.callback('5', 'but_5'), Markup.button.callback('6', 'but_6')]
            ])
        );
    });
});

const butterfly = {
    but_1: "🦋 Siz soddalikni yaxshi ko'rasiz. Odamlarning xatti-harakatlari qanchalik tushunarli bo'lsa, ular bilan tez til topish mumkin. \nKichkina narsalarda o'zingiz uchun asosiy quvonchni qidiring. Hissiy soddalik ham sizga xosdir. Hamma bilan to'g'ridan-to'g'ri gaplashing, maslahatlar va kichik yordamlarni yo'lini yopib tashlamang.",
    but_2: "🦋 Ushbu rasmga ishora qilgan odamlar ajoyib iroda va shaxsiy xususiyatlarga ega. Sizga doimiy harakat va oldinga yurish kerak. \nXarakterning o'ziga xos xususiyati sizning rejalaringiz, maqsadlaringiz va vazifalaringizni amalga oshirish uchun har qanday narsaga intilishingiz maqtovga loyiqdir",
    but_3: "🦋 Taqdim etilgan tanlov tinch tabiatni tavsiflaydi. Ular o'zlarini haddan tashqari zarba berishga yo'l qo'ymaydi va har doim sovuq fonda harakat qilishadi. \nBunday odamlar ko'pincha o'zlarini faqat aqilli fikrlaydigan odamlar bilan o'rab olishadi. Ko'pincha bu odamlar vaqtni yolg'izlikda  o'tkazishni yaxshi ko'radilar.",
    but_4: "🦋 Juda qiyin vaziyat. Gap shundaki, bunday odamlar haddan tashqari saxiylik bilan ajralib turadi. Bundan tashqari, u tom ma'noda hamma narsada namoyon bo'ladi: yordam, energiya, vaqt, maslahat. Ro'yxat davom etaveradi. \nBunday odamlar o'zlariga nisbatan bir xil munosabatni talab qiladi. Ammo faqat ozchilik buni berishi mumkin. Ushbu vaziatda esa ularda hayotdan kuchli norozilik rivojlanadi.",
    but_5: "🦋 Bunday odamlar o'zlarining individual xususiyatlarini aniq tushunishadi va bundan to'liq zavqlanishadi. Ular boshqasiga moslashishni istashmaydi va xohlamaydilar. Agar biror inson ularga yoqimsiz bo'lsa, unda bunday odamlar u bilan har qanday aloqani to'xtatadilar.",
    but_6: "🦋 Mutlaqo ochiq qalb bilan odamlarni tinchlantiraolasiz siz atrof-muhitga juda sezgir va ehtiyotkorlik bilan munosabatda bo'lasiz va hech qachon hech kimning manfaatlariga ziyon yetkazmaysiz Atrofdagilar bazida bunday yaqin odamlarini shunchaki unutib qo'yishadi lekin sizda eng kerakli hayit bilimlari bor bundan foydalaning"
};

Object.keys(butterfly).forEach(type => {
    bot.action(type, (ctx) => ctx.reply(butterfly[type]));
});

bot.launch();
