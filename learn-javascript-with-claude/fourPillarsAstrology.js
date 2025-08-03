// 四柱推命計算ライブラリ
// Author: claude.ai and me
// Model: Claude Sonnet 4
// Date: 2025/08/03

/**
 * 四柱推命を計算するメイン関数
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} day - 日
 * @param {number} hour - 時（24時間制）
 * @returns {string} 計算結果のテキスト
 */
function calculateFourPillarsAstrology(year, month, day, hour) {
    let output = [];
    
    // 生年月日時の情報
    const birthInfo = { year, month, day, hour };
    output.push(`生年月日時: ${year}年${month}月${day}日 ${hour}:00`);
    output.push("");
    
    // 干支の配列
    const tenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const twelveZodiac = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 時刻対応表（24時間制 → 十二支）
    const hourToZodiac = {
        23: 0, 0: 0, 1: 0,    // 子時 (23-01時)
        2: 1, 3: 1,           // 丑時 (01-03時) 
        4: 2, 5: 2,           // 寅時 (03-05時)
        6: 3, 7: 3,           // 卯時 (05-07時)
        8: 4, 9: 4,           // 辰時 (07-09時)
        10: 5, 11: 5,         // 巳時 (09-11時)
        12: 6, 13: 6,         // 午時 (11-13時)
        14: 7, 15: 7,         // 未時 (13-15時)
        16: 8, 17: 8,         // 申時 (15-17時)
        18: 9, 19: 9,         // 酉時 (17-19時)
        20: 10, 21: 10,       // 戌時 (19-21時)
        22: 11                // 亥時 (21-23時)
    };
    
    // 年柱の計算
    const yearStemIndex = (year - 4) % 10;
    const yearZodiacIndex = (year - 4) % 12;
    const yearStem = tenStems[yearStemIndex];
    const yearZodiac = twelveZodiac[yearZodiacIndex];
    
    // 月柱の計算（簡略化）
    // 実際の四柱推命では節気を考慮する必要がありますが、ここでは簡略化
    const monthZodiacIndex = (month + 1) % 12;
    const monthZodiac = twelveZodiac[monthZodiacIndex];
    
    // 月干の計算（年干によって決まる）
    const monthStemBase = {
        '甲': 2, '己': 2,  // 丙寅から
        '乙': 4, '庚': 4,  // 戊寅から
        '丙': 6, '辛': 6,  // 庚寅から
        '丁': 8, '壬': 8,  // 壬寅から
        '戊': 0, '癸': 0   // 甲寅から
    };
    
    const monthStemStart = monthStemBase[yearStem];
    const monthStemIndex = (monthStemStart + monthZodiacIndex) % 10;
    const monthStem = tenStems[monthStemIndex];
    
    // 日柱の計算（簡略化 - 実際はもっと複雑な計算が必要）
    // ここでは基本的な計算式を使用
    const totalDays = calculateTotalDays(year, month, day);
    const dayStemIndex = (totalDays - 1) % 10;
    const dayZodiacIndex = (totalDays - 1) % 12;
    const dayStem = tenStems[dayStemIndex];
    const dayZodiac = twelveZodiac[dayZodiacIndex];
    
    // 時柱の計算
    const hourZodiacIndex = hourToZodiac[hour];
    const hourZodiac = twelveZodiac[hourZodiacIndex];
    
    // 時干の計算（日干によって決まる）
    const hourStemBase = {
        '甲': 0, '己': 0,  // 甲から
        '乙': 2, '庚': 2,  // 丙から
        '丙': 4, '辛': 4,  // 戊から
        '丁': 6, '壬': 6,  // 庚から
        '戊': 8, '癸': 8   // 壬から
    };
    
    const hourStemStart = hourStemBase[dayStem];
    const hourStemIndex = (hourStemStart + hourZodiacIndex) % 10;
    const hourStem = tenStems[hourStemIndex];
    
    // 結果の出力
    output.push("=== 四柱命式 ===");
    output.push(`年柱: ${yearStem}${yearZodiac} (${year}年)`);
    output.push(`月柱: ${monthStem}${monthZodiac} (${month}月)`);
    output.push(`日柱: ${dayStem}${dayZodiac} (${day}日)`);
    output.push(`時柱: ${hourStem}${hourZodiac} (${hour}:00頃)`);
    output.push("");
    
    // 五行分析
    output.push("=== 五行分析 ===");
    const fiveElements = {
        木: [],
        火: [],
        土: [],
        金: [],
        水: []
    };
    
    // 各干支の五行分類
    const stemElements = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火', 
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    
    const zodiacElements = {
        '子': '水', '亥': '水',
        '寅': '木', '卯': '木',
        '巳': '火', '午': '火',
        '未': '土', '丑': '土', '辰': '土', '戌': '土',
        '申': '金', '酉': '金'
    };
    
    // 天干の五行
    fiveElements[stemElements[yearStem]].push(`年干:${yearStem}`);
    fiveElements[stemElements[monthStem]].push(`月干:${monthStem}`);
    fiveElements[stemElements[dayStem]].push(`日干:${dayStem}`);
    fiveElements[stemElements[hourStem]].push(`時干:${hourStem}`);
    
    // 地支の五行（主気のみ）
    fiveElements[zodiacElements[yearZodiac]].push(`年支:${yearZodiac}`);
    fiveElements[zodiacElements[monthZodiac]].push(`月支:${monthZodiac}`);
    fiveElements[zodiacElements[dayZodiac]].push(`日支:${dayZodiac}`);
    fiveElements[zodiacElements[hourZodiac]].push(`時支:${hourZodiac}`);
    
    for (let element in fiveElements) {
        if (fiveElements[element].length > 0) {
            output.push(`${element}性: ${fiveElements[element].join(', ')} (${fiveElements[element].length}個)`);
        }
    }
    
    // 通変星の基本分析
    output.push("");
    output.push(`=== 通変星分析（日干${dayStem}基準）===`);
    const tonghenStars = {
        '甲': getTonghenStar(dayStem, '甲'), '乙': getTonghenStar(dayStem, '乙'),
        '丙': getTonghenStar(dayStem, '丙'), '丁': getTonghenStar(dayStem, '丁'),
        '戊': getTonghenStar(dayStem, '戊'), '己': getTonghenStar(dayStem, '己'),
        '庚': getTonghenStar(dayStem, '庚'), '辛': getTonghenStar(dayStem, '辛'),
        '壬': getTonghenStar(dayStem, '壬'), '癸': getTonghenStar(dayStem, '癸')
    };
    
    output.push(`年干 ${yearStem}: ${tonghenStars[yearStem]}`);
    output.push(`月干 ${monthStem}: ${tonghenStars[monthStem]}`);
    output.push(`日干 ${dayStem}: ${tonghenStars[dayStem]} (自分自身)`);
    output.push(`時干 ${hourStem}: ${tonghenStars[hourStem]}`);
    
    return output.join('\n');
}

/**
 * 通算日数を計算する関数（簡略化）
 */
function calculateTotalDays(year, month, day) {
    // 1900年1月1日を基準とした通算日数の計算（簡略化）
    let totalDays = 0;
    
    // 年の日数を加算
    for (let y = 1900; y < year; y++) {
        totalDays += isLeapYear(y) ? 366 : 365;
    }
    
    // 月の日数を加算
    for (let m = 1; m < month; m++) {
        totalDays += getDaysInMonth(year, m);
    }
    
    // 日を加算
    totalDays += day;
    
    return totalDays;
}

/**
 * うるう年判定
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 指定した年月の日数を取得
 */
function getDaysInMonth(year, month) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) {
        return 29;
    }
    return daysInMonth[month - 1];
}

/**
 * 通変星を取得する関数
 */
function getTonghenStar(dayStem, targetStem) {
    // 五行の相性関係
    const stemElements = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火', 
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    
    const dayElement = stemElements[dayStem];
    const targetElement = stemElements[targetStem];
    
    // 陰陽の判定
    const isYang = ['甲', '丙', '戊', '庚', '壬'].includes(targetStem);
    const dayIsYang = ['甲', '丙', '戊', '庚', '壬'].includes(dayStem);
    
    // 通変星の判定
    if (dayStem === targetStem) {
        return '比肩';
    }
    
    if (dayElement === targetElement) {
        return isYang === dayIsYang ? '比肩' : '劫財';
    }
    
    // 生剋関係による判定
    const relations = {
        '木': { '火': 'child', '土': 'overcome', '金': 'overcome_by', '水': 'parent' },
        '火': { '土': 'child', '金': 'overcome', '水': 'overcome_by', '木': 'parent' },
        '土': { '金': 'child', '水': 'overcome', '木': 'overcome_by', '火': 'parent' },
        '金': { '水': 'child', '木': 'overcome', '火': 'overcome_by', '土': 'parent' },
        '水': { '木': 'child', '火': 'overcome', '土': 'overcome_by', '金': 'parent' }
    };
    
    const relation = relations[dayElement][targetElement];
    
    switch (relation) {
        case 'child':
            return isYang === dayIsYang ? '食神' : '傷官';
        case 'overcome':
            return isYang === dayIsYang ? '偏財' : '正財';
        case 'overcome_by':
            return isYang === dayIsYang ? '七殺' : '正官';
        case 'parent':
            return isYang === dayIsYang ? '偏印' : '印綬';
        default:
            return '不明';
    }
}