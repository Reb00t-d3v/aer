import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  buttonLink: string;
  popular?: boolean;
  onButtonClick?: () => void;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  buttonLink,
  popular = false,
  onButtonClick,
}: PricingCardProps) {
  return (
    <div className={cn(
      "border rounded-lg shadow-sm bg-white dark:bg-gray-800 p-6 hover:shadow-md transition-all relative",
      popular ? "border-primary" : "border-gray-200 dark:border-gray-700"
    )}>
      {popular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary text-white text-xs px-3 py-1 rounded-full">
          Popular
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      
      <p className="mt-4">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${price}</span>
        <span className="text-base font-medium text-gray-500 dark:text-gray-400">/{period}</span>
      </p>
      
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex">
            {feature.included ? (
              <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
            ) : (
              <XIcon className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{feature.text}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-8">
        <Button
          variant={popular ? "default" : "outline"}
          className={cn(
            "w-full",
            popular ? "" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          onClick={onButtonClick}
          asChild={!onButtonClick}
        >
          {onButtonClick ? (
            <span>{buttonText}</span>
          ) : (
            <a href={buttonLink}>{buttonText}</a>
          )}
        </Button>
      </div>
    </div>
  );
}
