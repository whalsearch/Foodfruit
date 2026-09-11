export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const k = process.env.USDA_API_KEY;
  if (!k) return res.status(500).json({ e: 1 });

  const { name } = req.query;
  if (!name) return res.status(400).json({ e: 2 });

  const m = {
    "آووکادو": "avocado", "سیب": "apple", "پرتقال": "orange",
    "موز": "banana", "هویج": "carrot", "اسفناج": "spinach",
    "گوجه": "tomato", "خیار": "cucumber", "زنجبیل": "ginger",
    "زردچوبه": "turmeric", "سیر": "garlic", "انار": "pomegranate",
    "توت‌فرنگی": "strawberry", "کیوی": "kiwi", "لیمو": "lemon",
    "انبه": "mango", "آناناس": "pineapple", "هندوانه": "watermelon",
    "انگور": "grape", "کلم": "cabbage", "کرفس": "celery",
    "فلفل دلمه": "bell pepper", "بادمجان": "eggplant",
    "چغندر": "beet", "زیتون": "olive", "انجیر": "fig",
    "نارگیل": "coconut", "بلوبری": "blueberry", "بابونه": "chamomile",
    "دارچین": "cinnamon", "ریحان": "basil", "جعفری": "parsley",
    "آویشن": "thyme", "اسطوخودوس": "lavender",
    "کدو سبز": "zucchini", "کدو تنبل": "pumpkin", "کدو": "squash",
    "بروکلی": "broccoli", "گل کلم": "cauliflower", "کاهو": "lettuce",
    "پیاز": "onion", "سیب زمینی": "potato", "تربچه": "radish",
    "شلغم": "turnip", "قارچ": "mushroom", "ذرت": "corn",
    "نعنا": "mint", "شوید": "dill", "رزماری": "rosemary",
    "مریم گلی": "sage", "گشنیز": "coriander",
    "بالنگ": "citron", "خرمالو": "persimmon", "به": "quince",
    "ازگیل": "medlar", "زالزالک": "hawthorn", "کنار": "jujube",
    "شنبلیله": "fenugreek", "سیاه دانه": "black seed", "رازیانه": "fennel",
    "زعفران": "saffron", "گل محمدی": "rose", "گل گاوزبان": "borage",
    "سنبل الطیب": "valerian", "خار مریم": "milk thistle", "آلوئه ورا": "aloe vera"
  };

  let q = m[name];

  // اگه توی دیکشنری نبود، ترجمه خودکار با MyMemory
  if (!q) {
    try {
      const tUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(name)}&langpair=fa|en`;
      const tRes = await fetch(tUrl);
      const tData = await tRes.json();
      
      if (tData.responseData && tData.responseData.translatedText) {
        q = tData.responseData.translatedText;
      } else {
        q = name;
      }
    } catch {
      q = name;
    }
  }

  const u = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${k}&query=${encodeURIComponent(q)}&pageSize=5&dataType=Foundation,SR%20Legacy`;

  try {
    const r = await fetch(u);
    const d = await r.json();
    return res.status(200).json(d);
  } catch {
    return res.status(500).json({ e: 3 });
  }
}
