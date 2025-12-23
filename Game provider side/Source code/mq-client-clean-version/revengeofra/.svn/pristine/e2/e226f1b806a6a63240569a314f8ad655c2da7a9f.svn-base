import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import HPDamageValue from './HPDamageValue';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

const BASE_MOVE_DISTANCE = -27;

class HPDamageAnimation extends Sprite
{

	startAnimation()
	{
		this._startAnimation();
	}

	constructor(aValue_num)
	{
		super();

		this._fValue_hpdv = null;

		this._initValueView(aValue_num);
	}

	_initValueView(aValue_num)
	{
		this._fValue_hpdv = this.addChild(new HPDamageValue(aValue_num));
	}

	_startAnimation()
	{
		let lFinalY_num = this._calcFinalValueY();
		this._fValue_hpdv.moveYTo(lFinalY_num, 23*FRAME_RATE);

		let fadeSeq = [
			{	tweens: [],
				duration: 5*FRAME_RATE				
			},
			{
				tweens: [{ prop: 'alpha', to: 0}],
				duration: 27*FRAME_RATE,
				onfinish: () => {
					this.destroy();
				}
			}
		]

		Sequence.start(this._fValue_hpdv, fadeSeq);
	}

	_calcFinalValueY()
	{
		let lOutBorderDistance_num = 0;

		let globalValuePos = this.localToGlobal(this._fValue_hpdv.x, this._fValue_hpdv.y) || new PIXI.Point(0, 0);
		let localValueBounds = this._fValue_hpdv.getLocalBounds();
		let globalValueTargetY = globalValuePos.y + localValueBounds.y + BASE_MOVE_DISTANCE;
		if (globalValueTargetY < 10)
		{
			lOutBorderDistance_num = 10 - globalValueTargetY + 5;
		}
		
		return this._fValue_hpdv.y + BASE_MOVE_DISTANCE + lOutBorderDistance_num;
	}

	destroy()
	{
		if (this._fValue_hpdv)
		{
			Sequence.destroy(Sequence.findByTarget(this._fValue_hpdv));
		}
		this._fValue_hpdv = null;

		super.destroy();
	}
}

export default HPDamageAnimation