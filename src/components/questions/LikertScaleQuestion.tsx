import { Question } from '../../types/test';
import { Slider } from '../ui/slider';

interface LikertScaleQuestionProps {
  question: Question;
  value?: number;
  onChange: (answer: number) => void;
}

const LikertScaleQuestion = ({ question, value, onChange }: LikertScaleQuestionProps) => {
  const [minLabel, maxLabel] = question.scaleLabels || ['Strongly Disagree', 'Strongly Agree'];
  const currentValue = value ?? 3; // Default to middle (3)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{question.title}</h3>
        <p className="text-gray-600">{question.description}</p>
        <p className="text-sm text-gray-500">{question.points} points</p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-8 space-y-6">
        <Slider
          value={[currentValue]}
          onValueChange={(val) => onChange(val[0])}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />

        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">1</div>
            <div className="text-sm text-gray-600">{minLabel}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">2</div>
            <div className="text-sm text-gray-600">Disagree</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-600">Neutral</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-600">Agree</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">{maxLabel}</div>
          </div>
        </div>

        <div className="text-center pt-4 border-t-2 border-gray-200">
          <div className="text-lg font-semibold text-blue-600">
            Your Selection: {currentValue}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikertScaleQuestion;
