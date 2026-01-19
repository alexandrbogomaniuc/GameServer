const SPINE_LIST = [
	
	{name: 'enemies/dark_knight/DarkKnight0', jsonScale: 1, textureScale: 1},
	{name: 'enemies/dark_knight/DarkKnight90', jsonScale: 1, textureScale: 1},
	{name: 'enemies/dark_knight/DarkKnight180', jsonScale: 1, textureScale: 1},
	{name: 'enemies/dark_knight/DarkKnight270', jsonScale: 1, textureScale: 1},

	{name: 'enemies/spiders/spider_brown/Spider0', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/spiders/spider_brown/Spider90', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/spiders/spider_brown/Spider180', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/spiders/spider_brown/Spider270', jsonScale: 1, textureScale: 0.5},

	{name: 'enemies/spiders/spider_black/Spider0', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/spiders/spider_black/Spider90', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/spiders/spider_black/Spider180', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/spiders/spider_black/Spider270', jsonScale: 1, textureScale: 0.5},

	{name: 'enemies/rats/Rat0', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat0', 'enemies/rats/black_rat/Rat0']},
	{name: 'enemies/rats/Rat45', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat45', 'enemies/rats/black_rat/Rat45']},
	{name: 'enemies/rats/Rat90', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat90', 'enemies/rats/black_rat/Rat90']},
	{name: 'enemies/rats/Rat135', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat135', 'enemies/rats/black_rat/Rat135']},
	{name: 'enemies/rats/Rat180', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat180', 'enemies/rats/black_rat/Rat180']},
	{name: 'enemies/rats/Rat225', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat225', 'enemies/rats/black_rat/Rat225']},
	{name: 'enemies/rats/Rat270', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat270', 'enemies/rats/black_rat/Rat270']},
	{name: 'enemies/rats/Rat315', jsonScale: 1, textureScale: 0.25, assets: ['enemies/rats/brown_rat/Rat315', 'enemies/rats/black_rat/Rat315']},

	{name: 'enemies/goblins/Goblin0', jsonScale: 1, textureScale: 0.3, assets: ['enemies/goblins/green/Goblin0', 'enemies/goblins/hobgoblin/Goblin0', 'enemies/goblins/duplicated/Goblin0']},
	{name: 'enemies/goblins/Goblin90', jsonScale: 1, textureScale: 0.3, assets: ['enemies/goblins/green/Goblin90', 'enemies/goblins/hobgoblin/Goblin90', 'enemies/goblins/duplicated/Goblin90']},
	{name: 'enemies/goblins/Goblin180', jsonScale: 1, textureScale: 0.3, assets: ['enemies/goblins/green/Goblin180', 'enemies/goblins/hobgoblin/Goblin180', 'enemies/goblins/duplicated/Goblin180']},
	{name: 'enemies/goblins/Goblin270', jsonScale: 1, textureScale: 0.3, assets: ['enemies/goblins/green/Goblin270', 'enemies/goblins/hobgoblin/Goblin270', 'enemies/goblins/duplicated/Goblin270']},

	{name: 'enemies/dragon/Dragon0', jsonScale: 1, textureScale: 1},

	{name: 'enemies/wizard/Monk_Demon0', jsonScale: 1, textureScale: 0.25, assets: ['enemies/wizards/red/Monk_Demon0', 'enemies/wizards/blue/Monk_Demon0', 'enemies/wizards/purple/Monk_Demon0']},
	{name: 'enemies/wizard/Monk_Demon90', jsonScale: 1, textureScale: 0.25, assets: ['enemies/wizards/red/Monk_Demon90', 'enemies/wizards/blue/Monk_Demon90', 'enemies/wizards/purple/Monk_Demon90']},
	{name: 'enemies/wizard/Monk_Demon180', jsonScale: 1, textureScale: 0.25, assets: ['enemies/wizards/red/Monk_Demon180', 'enemies/wizards/blue/Monk_Demon180', 'enemies/wizards/purple/Monk_Demon180']},
	{name: 'enemies/wizard/Monk_Demon270', jsonScale: 1, textureScale: 0.25, assets: ['enemies/wizards/red/Monk_Demon270', 'enemies/wizards/blue/Monk_Demon270', 'enemies/wizards/purple/Monk_Demon270']},
	
	{name: 'enemies/gargoyle/Gargoyle0', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/gargoyle/Gargoyle90', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/gargoyle/Gargoyle180', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/gargoyle/Gargoyle270', jsonScale: 1, textureScale: 0.5},

	{name: 'enemies/cerberus/Cerberus0', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/cerberus/Cerberus90', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/cerberus/Cerberus180', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/cerberus/Cerberus270', jsonScale: 1, textureScale: 0.5},

	{name: 'enemies/orc/Orc0', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/orc/Orc90', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/orc/Orc180', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/orc/Orc270', jsonScale: 1, textureScale: 0.5},

	{name: 'enemies/ogre/Ogre0', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/ogre/Ogre90', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/ogre/Ogre180', jsonScale: 1, textureScale: 0.5},
	{name: 'enemies/ogre/Ogre270', jsonScale: 1, textureScale: 0.5},

	{name: 'enemies/imp/Imp0', jsonScale: 1, textureScale: 0.5, assets: ['enemies/imp/red/Imp0', 'enemies/imp/green/Imp0']},
	{name: 'enemies/imp/Imp90', jsonScale: 1, textureScale: 0.5, assets: ['enemies/imp/red/Imp90', 'enemies/imp/green/Imp90']},
	{name: 'enemies/imp/Imp180', jsonScale: 1, textureScale: 0.5, assets: ['enemies/imp/red/Imp180', 'enemies/imp/green/Imp180']},
	{name: 'enemies/imp/Imp270', jsonScale: 1, textureScale: 0.5, assets: ['enemies/imp/red/Imp270', 'enemies/imp/green/Imp270']},

	{name: 'enemies/wall_knight/EmptyArmor0', jsonScale: 1, textureScale: 0.5, assets: ['enemies/wall_knight/silver/WallKnight0', 'enemies/wall_knight/blue/WallKnight0', 'enemies/wall_knight/gold/WallKnight0']},
	{name: 'enemies/wall_knight/EmptyArmor90', jsonScale: 1, textureScale: 0.5, assets: ['enemies/wall_knight/silver/WallKnight90', 'enemies/wall_knight/blue/WallKnight90', 'enemies/wall_knight/gold/WallKnight90']},
	{name: 'enemies/wall_knight/EmptyArmor180', jsonScale: 1, textureScale: 0.5, assets: ['enemies/wall_knight/silver/WallKnight180', 'enemies/wall_knight/blue/WallKnight180', 'enemies/wall_knight/gold/WallKnight180']},
	{name: 'enemies/wall_knight/EmptyArmor270', jsonScale: 1, textureScale: 0.5, assets: ['enemies/wall_knight/silver/WallKnight270', 'enemies/wall_knight/blue/WallKnight270', 'enemies/wall_knight/gold/WallKnight270']},
	{name: 'enemies/wall_knight/EmptyArmorIntro', jsonScale: 1, textureScale: 0.4728, assets: ['enemies/wall_knight/silver/WallKnightA90', 'enemies/wall_knight/blue/WallKnightA90', 'enemies/wall_knight/gold/WallKnightA90']},

	{name: 'enemies/specter/Specter0', jsonScale: 1, textureScale: 0.25, assets: ['enemies/specter/fire/Specter0', 'enemies/specter/lightning/Specter0', 'enemies/specter/spirit/Specter0']},
	{name: 'enemies/specter/Specter90', jsonScale: 1, textureScale: 0.25, assets: ['enemies/specter/fire/Specter90', 'enemies/specter/lightning/Specter90', 'enemies/specter/spirit/Specter90']},

	{name: 'enemies/skeleton/Skeleton0', jsonScale: 1, textureScale: 0.5, assets: ['enemies/skeletons/skeleton/Skeleton0', 'enemies/skeletons/skeleton_shield/SkeletonShield0']},
	{name: 'enemies/skeleton/Skeleton90', jsonScale: 1, textureScale: 0.5, assets: ['enemies/skeletons/skeleton/Skeleton90', 'enemies/skeletons/skeleton_shield/SkeletonShield90']},
	{name: 'enemies/skeleton/Skeleton180', jsonScale: 1, textureScale: 0.5, assets: ['enemies/skeletons/skeleton/Skeleton180', 'enemies/skeletons/skeleton_shield/SkeletonShield180']},
	{name: 'enemies/skeleton/Skeleton270', jsonScale: 1, textureScale: 0.5, assets: ['enemies/skeletons/skeleton/Skeleton270', 'enemies/skeletons/skeleton_shield/SkeletonShield270']},

	{name: 'enemies/raven/Raven0', jsonScale: 1, textureScale: 1},
	{name: 'enemies/raven/Raven90', jsonScale: 1, textureScale: 1},
	{name: 'enemies/raven/Raven180', jsonScale: 1, textureScale: 1},
	{name: 'enemies/raven/Raven270', jsonScale: 1, textureScale: 1},

	{name: 'enemies/bat/Bat0', jsonScale: 1, textureScale: 0.25},
	{name: 'enemies/bat/Bat90', jsonScale: 1, textureScale: 0.25},
	{name: 'enemies/bat/Bat180', jsonScale: 1, textureScale: 0.25},
	{name: 'enemies/bat/Bat270', jsonScale: 1, textureScale: 0.25},

];

export default SPINE_LIST;