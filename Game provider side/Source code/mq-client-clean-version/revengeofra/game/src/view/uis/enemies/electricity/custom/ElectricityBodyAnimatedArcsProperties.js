import { DIRECTION } from '../../../../../main/enemies/Enemy';
import { ENEMIES } from '../../../../../../../shared/src/CommonConstants';

export const ANIMATED_ARCS_POSITIONS = 
{
	[ENEMIES.Anubis] : 	{
									[DIRECTION.LEFT_UP] :	[
																{x: -35, y: -165-40, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -70-40, angle: -5, scaleXDirectionMult: -1},
																{x: -25, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45, y: -110-40, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -80-40, angle: 10, scaleXDirectionMult: -1},
																{x: -40, y: -60-40, angle: 0, scaleXDirectionMult: 1},
																{x: -25, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45, y: -110-40, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.LEFT_DOWN] :	[
																{x: -50+20, y: -150-40, angle: 0, scaleXDirectionMult: 1},
																{x: -55+20, y: -60-40, angle: 0, scaleXDirectionMult: 1},
																{x: -50+20, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -60+20, y: -110-40, angle: 0, scaleXDirectionMult: 1},
																{x: -52+20, y: -70-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45+20, y: -50-40, angle: 0, scaleXDirectionMult: 1},
																{x: -50+20, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -60+20, y: -110-40, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.RIGHT_UP] :	[
																{x: 30-20, y: -165-40, angle: 0, scaleXDirectionMult: -1},
																{x: 10-20, y: -65-40, angle: 0, scaleXDirectionMult: 1},
																{x: 40-20, y: -135-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-20, y: -110-40, angle: 0, scaleXDirectionMult: -1},
																{x: 10-20, y: -95-40, angle: 10, scaleXDirectionMult: 1},
																{x: 55-20, y: -65-40, angle: 0, scaleXDirectionMult: -1},
																{x: 40-20, y: -135-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-20, y: -110-40, angle: 0, scaleXDirectionMult: -1}
															],
									[DIRECTION.RIGHT_DOWN] :[
																{x: 45-10, y: -140-40, angle: 0, scaleXDirectionMult: -1},
																{x: 57-10, y: -57-40, angle: 0, scaleXDirectionMult: -1},
																{x: 35-10, y: -125-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-10, y: -110-40, angle: 0, scaleXDirectionMult: -1},
																{x: 55-10, y: -65-40, angle: 10, scaleXDirectionMult: -1},
																{x: 43-10, y: -65-40, angle: 0, scaleXDirectionMult: -1},
																{x: 35-10, y: -125-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-10, y: -110-40, angle: 0, scaleXDirectionMult: -1}
															]
	},
	[ENEMIES.Osiris] : 	{
									[DIRECTION.LEFT_UP] :	[
																{x: -35, y: -165-40, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -70-40, angle: -5, scaleXDirectionMult: -1},
																{x: -25, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45, y: -110-40, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -80-40, angle: 10, scaleXDirectionMult: -1},
																{x: -40, y: -60-40, angle: 0, scaleXDirectionMult: 1},
																{x: -25, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45, y: -110-40, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.LEFT_DOWN] :	[
																{x: -50+20, y: -150-40, angle: 0, scaleXDirectionMult: 1},
																{x: -55+20, y: -60-40, angle: 0, scaleXDirectionMult: 1},
																{x: -50+20, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -60+20, y: -110-40, angle: 0, scaleXDirectionMult: 1},
																{x: -52+20, y: -70-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45+20, y: -50-40, angle: 0, scaleXDirectionMult: 1},
																{x: -50+20, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -60+20, y: -110-40, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.RIGHT_UP] :	[
																{x: 30-20, y: -165-40, angle: 0, scaleXDirectionMult: -1},
																{x: 10-20, y: -65-40, angle: 0, scaleXDirectionMult: 1},
																{x: 40-20, y: -135-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-20, y: -110-40, angle: 0, scaleXDirectionMult: -1},
																{x: 10-20, y: -95-40, angle: 10, scaleXDirectionMult: 1},
																{x: 55-20, y: -65-40, angle: 0, scaleXDirectionMult: -1},
																{x: 40-20, y: -135-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-20, y: -110-40, angle: 0, scaleXDirectionMult: -1}
															],
									[DIRECTION.RIGHT_DOWN] :[
																{x: 45-10, y: -140-40, angle: 0, scaleXDirectionMult: -1},
																{x: 57-10, y: -57-40, angle: 0, scaleXDirectionMult: -1},
																{x: 35-10, y: -125-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-10, y: -110-40, angle: 0, scaleXDirectionMult: -1},
																{x: 55-10, y: -65-40, angle: 10, scaleXDirectionMult: -1},
																{x: 43-10, y: -65-40, angle: 0, scaleXDirectionMult: -1},
																{x: 35-10, y: -125-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-10, y: -110-40, angle: 0, scaleXDirectionMult: -1}
															]
	},
	[ENEMIES.Thoth] : 	{
									[DIRECTION.LEFT_UP] :	[
																{x: -35, y: -165-40, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -70-40, angle: -5, scaleXDirectionMult: -1},
																{x: -25, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45, y: -110-40, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -80-40, angle: 10, scaleXDirectionMult: -1},
																{x: -40, y: -60-40, angle: 0, scaleXDirectionMult: 1},
																{x: -25, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45, y: -110-40, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.LEFT_DOWN] :	[
																{x: -50+20, y: -150-40, angle: 0, scaleXDirectionMult: 1},
																{x: -55+20, y: -60-40, angle: 0, scaleXDirectionMult: 1},
																{x: -50+20, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -60+20, y: -110-40, angle: 0, scaleXDirectionMult: 1},
																{x: -52+20, y: -70-40, angle: 0, scaleXDirectionMult: 1},
																{x: -45+20, y: -50-40, angle: 0, scaleXDirectionMult: 1},
																{x: -50+20, y: -125-40, angle: 0, scaleXDirectionMult: 1},
																{x: -60+20, y: -110-40, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.RIGHT_UP] :	[
																{x: 30-20, y: -165-40, angle: 0, scaleXDirectionMult: -1},
																{x: 10-20, y: -65-40, angle: 0, scaleXDirectionMult: 1},
																{x: 40-20, y: -135-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-20, y: -110-40, angle: 0, scaleXDirectionMult: -1},
																{x: 10-20, y: -95-40, angle: 10, scaleXDirectionMult: 1},
																{x: 55-20, y: -65-40, angle: 0, scaleXDirectionMult: -1},
																{x: 40-20, y: -135-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-20, y: -110-40, angle: 0, scaleXDirectionMult: -1}
															],
									[DIRECTION.RIGHT_DOWN] :[
																{x: 45-10, y: -140-40, angle: 0, scaleXDirectionMult: -1},
																{x: 57-10, y: -57-40, angle: 0, scaleXDirectionMult: -1},
																{x: 35-10, y: -125-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-10, y: -110-40, angle: 0, scaleXDirectionMult: -1},
																{x: 55-10, y: -65-40, angle: 10, scaleXDirectionMult: -1},
																{x: 43-10, y: -65-40, angle: 0, scaleXDirectionMult: -1},
																{x: 35-10, y: -125-40, angle: 0, scaleXDirectionMult: -1},
																{x: 50-10, y: -110-40, angle: 0, scaleXDirectionMult: -1}
															]
	},
	[ENEMIES.MummyGodGreen] : 	{
									[DIRECTION.LEFT_UP] :	[
																{x: -23, y: -95, angle: 0, scaleXDirectionMult: 1},
																{x: 23, y: -48, angle: -5, scaleXDirectionMult: -1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -35, y: -55, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -60, angle: 10, scaleXDirectionMult: -1},
																{x: -25, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -35, y: -55, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.LEFT_DOWN] :	[
																{x: -20, y: -95, angle: 0, scaleXDirectionMult: 1},
																{x: -25, y: -48, angle: 0, scaleXDirectionMult: 1},
																{x: -20, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -30, y: -55, angle: 0, scaleXDirectionMult: 1},
																{x: -22, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -20, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -30, y: -55, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.RIGHT_UP] :	[
																{x: 20, y: -95, angle: 0, scaleXDirectionMult: -1},
																{x: 0, y: -48, angle: 0, scaleXDirectionMult: 1},
																{x: 20, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 30, y: -55, angle: 0, scaleXDirectionMult: -1},
																{x: -5, y: -60, angle: 10, scaleXDirectionMult: 1},
																{x: 25, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 20, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 30, y: -55, angle: 0, scaleXDirectionMult: -1}
															],
									[DIRECTION.RIGHT_DOWN] :[
																{x: 20, y: -90, angle: 0, scaleXDirectionMult: -1},
																{x: 30, y: -52, angle: 0, scaleXDirectionMult: -1},
																{x: 20, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 15, y: -55, angle: 0, scaleXDirectionMult: -1},
																{x: 30, y: -60, angle: 10, scaleXDirectionMult: -1},
																{x: 23, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 20, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 15, y: -55, angle: 0, scaleXDirectionMult: -1}
															]
	},
	[ENEMIES.MummySmallWhite] : 	{
									[DIRECTION.LEFT_UP] :	[
																{x: -20, y: -80, angle: 0, scaleXDirectionMult: 1},
																{x: 15, y: -48, angle: -5, scaleXDirectionMult: -1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -25, y: -55, angle: 0, scaleXDirectionMult: 1},
																{x: 14, y: -60, angle: 15, scaleXDirectionMult: -1},
																{x: -25, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -25, y: -55, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.LEFT_DOWN] :	[
																{x: -15, y: -80, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -48, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -55, angle: 0, scaleXDirectionMult: 1},
																{x: -18, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -60, angle: 0, scaleXDirectionMult: 1},
																{x: -15, y: -55, angle: 0, scaleXDirectionMult: 1}
															],
									[DIRECTION.RIGHT_UP] :	[
																{x: 10, y: -80, angle: 0, scaleXDirectionMult: -1},
																{x: -5, y: -48, angle: 0, scaleXDirectionMult: 1},
																{x: 10, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 13, y: -55, angle: 0, scaleXDirectionMult: -1},
																{x: -10, y: -60, angle: 10, scaleXDirectionMult: 1},
																{x: 15, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 10, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 13, y: -55, angle: 0, scaleXDirectionMult: -1}
															],
									[DIRECTION.RIGHT_DOWN] :[
																{x: 10, y: -80, angle: 0, scaleXDirectionMult: -1},
																{x: 15, y: -48, angle: 0, scaleXDirectionMult: -1},
																{x: 10, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 15, y: -55, angle: 0, scaleXDirectionMult: -1},
																{x: 12, y: -63, angle: 15, scaleXDirectionMult: -1},
																{x: 15, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 10, y: -60, angle: 0, scaleXDirectionMult: -1},
																{x: 13, y: -55, angle: 0, scaleXDirectionMult: -1}
															]
	}
	
};

export const ANIMATED_ARCS_SCALES = 
{
	[ENEMIES.Anubis]: 	1.5 * 1.25,
	[ENEMIES.Osiris]: 	1.5 * 1.25,
	[ENEMIES.Thoth]: 	1.5 * 1.25,
	[ENEMIES.MummyGodGreen]: 	0.8,
	[ENEMIES.MummySmallWhite]: 	0.7
}