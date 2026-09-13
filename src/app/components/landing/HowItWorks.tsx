import {
  UserRoundPlus,
  ListFilter,
  Send,
} from 'lucide-react';

const steps = [
  {
    number: '1.',
    title: 'Create Profile',
    description:
      'Build your professional profile showcasing your academic achievements, skills, and projects.',
    icon: UserRoundPlus,
  },
  {
    number: '2.',
    title: 'Discover Matches',
    description:
      'Our system connects your profile with tailored job and internship opportunities from top employers.',
    icon: ListFilter,
  },
  {
    number: '3.',
    title: 'Apply & Connect',
    description:
      'Apply directly through the platform and manage your applications in one centralized dashboard.',
    icon: Send,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#f8f8ff]">
      <div className="mx-auto max-w-[1200px] px-8 py-10">
        
        <h2 className="text-center text-base font-semibold text-[#20243a]">
          How UniCareer Works
        </h2>

        <div className="mt-8 grid grid-cols-3 gap-12">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5145e5] text-white">
                  <Icon size={18} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#20243a]">
                  {step.number} {step.title}
                </h3>

                <p className="mt-2 max-w-[310px] text-xs leading-5 text-[#62667b]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}