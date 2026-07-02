
// ============================================================
//  用户数据库
// ============================================================
const USERS = {
    'admin': { password: '142857jj', role: 'admin', display_name: '管理员' },
    '95381694': { password: '1478', role: 'viewer', display_name: '汪行虎' },
    '96687409': { password: '3318', role: 'viewer', display_name: '魏邦俭' },
    '96923491': { password: '0610', role: 'viewer', display_name: '沈耀成' },
    '96685719': { password: '2219', role: 'entry', display_name: '刘建' },
    '95381480': { password: '6012', role: 'entry', display_name: '董世钟' },
    '96687421': { password: '8315', role: 'entry', display_name: '吕奇' },
    '95381531': { password: '6738', role: 'entry', display_name: '伍凡' },
    '96687380': { password: '8773', role: 'entry', display_name: '项武' },
    '96685730': { password: '1510', role: 'entry', display_name: '傅俊森' },
    '96687419': { password: '1819', role: 'entry', display_name: '王世杰' },
    '96687418': { password: '4738', role: 'entry', display_name: '孙永杰' },
    '83184896': { password: '4896', role: 'entry', display_name: 'AMIR HOSSAIN' },
    '76733590': { password: '391X', role: 'entry', display_name: '王建' },
    '76725659': { password: '3637', role: 'entry', display_name: '李红帅' },
    '76747460': { password: '3658', role: 'entry', display_name: '李濮龙' },
    '76722199': { password: '3616', role: 'entry', display_name: '王玉广' },
    '96687298': { password: '5857', role: 'entry', display_name: '董凤培' },
    '96687309': { password: '2811', role: 'entry', display_name: '马玉奇' },
    '74132297': { password: '1514', role: 'entry', display_name: '韩传勃' }
};

// ============================================================
//  常量
// ============================================================
const TEAMS = ['马玉奇(Ma Yuqi)', '王建(Wang Jian)', 'Kumar', '郭传海(Guo Chuanhai)', '曹桂龙(Cao Guilong)', '陈传军(Chen Chuanjun)', '王世杰(Wang Shijie)', 'Sheharyar', 'Anwar'];
const AREAS = ['110', '210', '220', '240', '320', '330', '400', '800', 'precast yard 1', 'precast yard 2'];
const WORKER_TYPES = ['木工', '瓦工', '钢筋工', '架子工', '旗手', '小工', '起重工', '测量工', '焊工'];

// ============================================================
//  工作字典（中英文对照）
// ============================================================
const WORK_DICT = {
    "无收入项": {
        "送水送饭倒运材料": { code: "N/A", unit: "工时", en: "Water/food delivery & material handling" },
        "开会": { code: "N/A", unit: "工时", en: "Meeting" },
        "配合测量": { code: "N/A", unit: "工时", en: "Survey assistance" },
        "配合材料组": { code: "N/A", unit: "工时", en: "Material team assistance" },
        "配合降水": { code: "N/A", unit: "工时", en: "Dewatering assistance" },
        "旗手": { code: "N/A", unit: "工时", en: "Flagman / Signalman" },
        "其他杂活": { code: "N/A", unit: "工时", en: "Other miscellaneous work" }
    },
    "土石方工程": {
        "人工挖土方（深度1.5m以内）": { code: "1-1-001", unit: "m3", en: "Manual excavation of earth (depth ≤1.5m)" },
        "人工挖桩间土": { code: "1-1-004", unit: "m3", en: "Manual excavation of soil between piles" },
        "人工回填（就地松填）": { code: "1-1-005", unit: "m3", en: "Manual backfill – loose fill (in-place)" },
        "人工回填（夯填）": { code: "1-1-006", unit: "m3", en: "Manual backfill – compacted fill" },
        "人工配合机械回填": { code: "1-1-007", unit: "m3", en: "Manual assistance for machine backfill" },
        "人工平整场地、清理铲平机挖余土、配合机械平整水稳层": { code: "1-1-009", unit: "m2", en: "Manual site leveling, cleaning machine-excavated surplus soil, assisting machine leveling of water-stabilized layer" },
        "人工原土打夯": { code: "1-1-010", unit: "m2", en: "Manual compaction of natural soil" },
        "人工运土（运距20米以内）": { code: "1-1-011", unit: "m3", en: "Manual earth transport (haul distance ≤20m)" },
        "砂垫层人工找平夯实": { code: "1-1-013", unit: "m3", en: "Manual leveling and compaction of sand cushion layer" },
        "级配砂石人工平整夯实": { code: "1-1-014", unit: "m3", en: "Manual leveling and compaction of graded sand and gravel" },
        "铺碎石人工夯实": { code: "1-1-015", unit: "m3", en: "Manual compaction of crushed stone" },
        "截、破砼实心桩（桩径1000mm以内）": { code: "1-1-016", unit: "根", en: "Cutting/breaking solid concrete piles (pile diameter ≤1000mm)" },
        "人工破砼（有筋）": { code: "1-1-020", unit: "m3", en: "Manual breaking of reinforced concrete" },
        "人工破砼（无筋）": { code: "1-1-021", unit: "m3", en: "Manual breaking of plain concrete (unreinforced)" },
        "扣件修理": { code: "1-1-022", unit: "个", en: "Repair of couplers/scaffold fittings" },
        "钢管打捆装车": { code: "1-1-023", unit: "t", en: "Bundling and loading of steel pipes" },
        "周转材料装卸车（机械配合）": { code: "1-1-024", unit: "t", en: "Loading/unloading of reusable materials (with machine assistance)" },
        "周转材料装卸车（纯人工）": { code: "1-1-025", unit: "t", en: "Loading/unloading of reusable materials (purely manual)" },
        "场地盖土网 覆盖、回收、整理": { code: "1-1-026", unit: "m2", en: "Site dust net – covering, recovery, and organizing" },
        "机械土方（挖、装、运，运距1公里内）": { code: "1-1-034", unit: "m3", en: "Machine earthwork (excavation, loading, transport, within 1km)" }
    },
    "模板工程": {
        "垫层模板": { code: "1-3-001", unit: "m2", en: "Lean concrete formwork" },
        "道路模板": { code: "1-3-002", unit: "m2", en: "Road formwork" },
        "基础模板": { code: "1-3-003", unit: "m2", en: "Foundation formwork" },
        "结构模板": { code: "1-3-004", unit: "m2", en: "Structural formwork" },
        "结构（施工层无现浇板）模板": { code: "1-3-005", unit: "m2", en: "Structural formwork (floor without cast-in-place slab)" },
        "预留洞制、安、拆（深1m以内）": { code: "1-3-008", unit: "个", en: "Fabrication, installation, and removal of openings ≤1m deep" },
        "预留洞制、安、拆（深1m以上）": { code: "1-3-009", unit: "个", en: "Fabrication, installation, and removal of openings >1m deep" },
        "套管安装（Φ500mm以内）": { code: "1-3-010", unit: "个", en: "Sleeve installation (≤Φ500mm)" },
        "套管安装（Φ1000mm以内）": { code: "1-3-011", unit: "个", en: "Sleeve installation (≤Φ1000mm)" },
        "套管安装（Φ1000mm以上）": { code: "1-3-012", unit: "个", en: "Sleeve installation (>Φ1000mm)" },
        "对拉螺杆（对拉扁铁）制作": { code: "1-3-013", unit: "根", en: "Fabrication of through-tie rods / flat iron ties" },
        "预埋螺栓安装（Φ20mm以内）": { code: "1-3-014", unit: "根", en: "Installation of embedded bolts (≤Φ20mm)" },
        "预埋螺栓安装（Φ20-40mm以内）": { code: "1-3-015", unit: "根", en: "Installation of embedded bolts (Φ20–40mm)" },
        "预埋螺栓安装（Φ40-60mm以内）": { code: "1-3-016", unit: "根", en: "Installation of embedded bolts (Φ40–60mm)" },
        "预埋铁件安装（周长800mm以内）": { code: "1-3-019", unit: "块", en: "Installation of embedded steel parts (perimeter ≤800mm)" },
        "预埋铁件安装（周长2000mm以内）": { code: "1-3-021", unit: "块", en: "Installation of embedded steel parts (perimeter ≤2000mm)" },
        "预埋铁件安装（周长2000mm以上）": { code: "1-3-023", unit: "块", en: "Installation of embedded steel parts (perimeter >2000mm)" }
    },
    "架子工程": {
        "双排脚手架（高度≤6m）": { code: "1-4-001", unit: "m2", en: "Double-row scaffolding (height ≤6m)" },
        "双排脚手架（高度≤12m）": { code: "1-4-002", unit: "m2", en: "Double-row scaffolding (height ≤12m)" },
        "双排脚手架（高度≤18m）": { code: "1-4-003", unit: "m2", en: "Double-row scaffolding (height ≤18m)" },
        "双排脚手架（高度≤24m）": { code: "1-4-004", unit: "m2", en: "Double-row scaffolding (height ≤24m)" },
        "双排脚手架（高度≤30m）": { code: "1-4-005", unit: "m2", en: "Double-row scaffolding (height ≤30m)" },
        "双排脚手架（高度30m以上）": { code: "1-4-006", unit: "m2", en: "Double-row scaffolding (height >30m)" },
        "承重（支模）满堂脚手架,基本层（高度5m以内）立杆间距1200*1200mm以内": { code: "1-4-007", unit: "m3", en: "Load-bearing full scaffolding – base layer (height ≤5m), post spacing ≤1200×1200mm" },
        "承重（支模）满堂脚手架,基本层（高度5m以内）立杆间距1000*1000mm以内": { code: "1-4-008", unit: "m2", en: "Load-bearing full scaffolding – base layer (height ≤5m), post spacing ≤1000×1000mm" },
        "承重（支模）满堂脚手架,基本层（高度5m以内）立杆间距600*600mm以内": { code: "1-4-009", unit: "m2", en: "Load-bearing full scaffolding – base layer (height ≤5m), post spacing ≤600×600mm" },
        "承重（支模）满堂脚手架,基本层（高度5m以内）立杆间距500*500mm以内": { code: "1-4-010", unit: "m2", en: "Load-bearing full scaffolding – base layer (height ≤5m), post spacing ≤500×500mm" },
        "承重（支模）满堂脚手架,基本层（高度5m以内）每增高1m增加": { code: "1-4-011", unit: "m2", en: "Load-bearing full scaffolding – base layer (height ≤5m), additional cost per 1m height increase" },
        "承重（高支模）满堂脚手架（压缩机、汽轮机）立杆间距400*400mm以内": { code: "1-4-012", unit: "m2", en: "Heavy-duty (high-support) full scaffolding (for compressor/turbine), post spacing ≤400×400mm" },
        "非承重满堂脚手架基本层（高度5m以内）立杆间距1600*1600mm以内": { code: "1-4-013", unit: "m2", en: "Non-load-bearing full scaffolding – base layer (height ≤5m), post spacing ≤1600×1600mm" },
        "非承重满堂脚手架基本层（高度5m以内）每增高1m增加": { code: "1-4-014", unit: "m2", en: "Non-load-bearing full scaffolding – base layer (height ≤5m), additional cost per 1m height increase" },
        "单排脚手架(高度≤6m)": { code: "1-4-015", unit: "m2", en: "Single-row scaffolding (height ≤6m)" },
        "单排脚手架(高度≤12m)": { code: "1-4-016", unit: "m2", en: "Single-row scaffolding (height ≤12m)" },
        "挑檐、挑梁架（不计标高纯架子高度）单杆斜立外挑高度≤6m": { code: "1-4-017", unit: "m2", en: "Eaves/balcony bracket – single-pole inclined, cantilever height ≤6m" },
        "挑檐、挑梁架（不计标高纯架子高度）单杆斜立外挑高度＞6m≤10m": { code: "1-4-018", unit: "m2", en: "Eaves/balcony bracket – cantilever height >6m and ≤10m" },
        "挑檐、挑梁架（不计标高纯架子高度）单杆斜立外挑高度＞10m": { code: "1-4-019", unit: "m2", en: "Eaves/balcony bracket – cantilever height >10m" },
        "独立柱（井式）脚手架（高度5m以内）": { code: "1-4-020", unit: "座", en: "Independent column (tower) scaffolding (height ≤5m)" },
        "独立柱（井式）脚手架（高度10m以内）": { code: "1-4-021", unit: "座", en: "Independent column scaffolding (height ≤10m)" },
        "独立柱（井式）脚手架（高度15m以内）": { code: "1-4-022", unit: "座", en: "Independent column scaffolding (height ≤15m)" },
        "独立柱（井式）脚手架（高度20m以内）": { code: "1-4-023", unit: "座", en: "Independent column scaffolding (height ≤20m)" },
        "独立柱（井式）脚手架（高度20m以上）": { code: "1-4-024", unit: "座", en: "Independent column scaffolding (height >20m)" },
        "吊架(跳板离地高度5m以内)": { code: "1-4-025", unit: "m2", en: "Suspended scaffold (plank height ≤5m)" },
        "吊架(跳板离地高度10m以内)": { code: "1-4-026", unit: "m2", en: "Suspended scaffold (plank height ≤10m)" },
        "吊架(跳板离地高度15m以内)": { code: "1-4-027", unit: "m2", en: "Suspended scaffold (plank height ≤15m)" },
        "吊架(跳板离地高度20m以内)": { code: "1-4-028", unit: "m2", en: "Suspended scaffold (plank height ≤20m)" },
        "吊架(跳板离地高度20m以上)": { code: "1-4-029", unit: "m2", en: "Suspended scaffold (plank height >20m)" },
        "水平兜网": { code: "1-4-030", unit: "m2", en: "Horizontal safety net (catch net)" },
        "斜道": { code: "1-4-031", unit: "跑", en: "Ramp / inclined access way" },
        "钢管安全维护(双杆)": { code: "1-4-032", unit: "m", en: "Steel pipe safety barrier (double rail)" },
        "钢管安全维护(单杆)": { code: "1-4-033", unit: "m", en: "Steel pipe safety barrier (single rail)" },
        "钢筋棚、木工棚、铆焊棚、材料棚等搭拆": { code: "1-4-041", unit: "m2", en: "Erection and dismantling of rebar workshop, carpentry workshop, welding workshop, material shed, etc." }
    },
    "钢筋工程": {
        "水池底板及筏板基础": { code: "1-5-001", unit: "t", en: "Reservoir bottom slab and raft foundation" },
        "水池壁板": { code: "1-5-002", unit: "t", en: "Reservoir wall / tank wall" },
        "基础": { code: "1-5-003", unit: "t", en: "Foundation" },
        "结构": { code: "1-5-004", unit: "t", en: "Structural" },
        "钢筋搭接焊": { code: "1-5-008", unit: "头", en: "Rebar lap welding" },
        "植筋Φ10mm以内": { code: "1-5-009", unit: "根", en: "Rebar doweling / post-installed rebar (≤Φ10mm)" },
        "植筋Φ12mm-14mm": { code: "1-5-010", unit: "根", en: "Rebar doweling (Φ12–14mm)" },
        "植筋Φ16mm-18mm": { code: "1-5-011", unit: "根", en: "Rebar doweling (Φ16–18mm)" },
        "植筋Φ20mm-25mm": { code: "1-5-012", unit: "根", en: "Rebar doweling (Φ20–25mm)" },
        "植筋Φ25mm以上": { code: "1-5-013", unit: "根", en: "Rebar doweling (>Φ25mm)" }
    },
    "砌筑工程": {
        "砌基础（小红砖）": { code: "1-6-001", unit: "m3", en: "Masonry foundation (common brick)" }
    },
    "混凝土工程": {
        "汽车泵砼浇筑（基础）": { code: "1-7-001", unit: "m3", en: "Concrete pouring via truck pump (foundation)" },
        "汽车泵砼浇筑高度50m内（结构）": { code: "1-7-002", unit: "m3", en: "Concrete pouring via truck pump – structure, height ≤50m" },
        "人工上料（二次倒运）手推车运砼浇捣": { code: "1-7-008", unit: "m3", en: "Manual material feeding (secondary hauling) and handcart transport for concrete pouring" },
        "道路砼（厚200mm）": { code: "1-7-010", unit: "m2", en: "Road concrete (thickness 200mm)" },
        "混凝土井": { code: "1-7-020", unit: "m3", en: "Concrete manhole / well" },
        "设备基础灌浆（含模板）": { code: "1-7-021", unit: "m3", en: "Equipment base grouting (including formwork)" },
        "砼面打磨": { code: "1-7-024", unit: "m2", en: "Concrete surface grinding" },
        "砼面凿毛": { code: "1-7-025", unit: "m2", en: "Concrete surface roughening / scabbling" },
        "砂浆垫块制作": { code: "1-7-026", unit: "m2", en: "Manufacture of mortar spacer blocks" },
        "沟盖板预制": { code: "1-7-027", unit: "m3", en: "Precast trench cover slabs" },
        "沟盖板安装": { code: "1-7-028", unit: "m3", en: "Installation of trench cover slabs" },
        "铸铁、玻璃钢沟盖板安装": { code: "1-7-029", unit: "块", en: "Installation of cast iron / FRP trench cover slabs" },
        "地坪混凝土浇筑（厚50mm）": { code: "", unit: "m2", en: "Concrete paving (thickness 50mm)" },
        "地坪混凝土浇筑（厚100mm）": { code: "", unit: "m2", en: "Concrete paving (thickness 100mm)" },
        "地坪混凝土浇筑（厚150mm）": { code: "", unit: "m2", en: "Concrete paving (thickness 150mm)" },
        "地坪混凝土浇筑（厚200mm）": { code: "", unit: "m2", en: "Concrete paving (thickness 200mm)" },
        "井安装": { code: "", unit: "m", en: "Manhole installation" },
        "水沟安装": { code: "", unit: "m", en: "Trench / ditch installation" }
    }
};
