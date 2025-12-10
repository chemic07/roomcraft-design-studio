import { motion } from 'framer-motion';
import { 
  Box, 
  Layers, 
  Move3D, 
  Palette, 
  Save, 
  Share2,
  Lightbulb,
  Grid3X3
} from 'lucide-react';

const features = [
  {
    icon: Box,
    title: '3D Model Library',
    description: 'Access 200+ professionally designed furniture models across all room categories.',
  },
  {
    icon: Move3D,
    title: 'Drag & Drop Editor',
    description: 'Intuitive controls to place, rotate, and scale objects in your virtual room.',
  },
  {
    icon: Layers,
    title: 'Custom Walls',
    description: 'Design rooms of any shape and size with our flexible wall creation tools.',
  },
  {
    icon: Lightbulb,
    title: 'Realistic Lighting',
    description: 'Add ambient and directional lights to see your design in different conditions.',
  },
  {
    icon: Palette,
    title: 'Material Editor',
    description: 'Customize colors and textures to match your personal style preferences.',
  },
  {
    icon: Grid3X3,
    title: 'Smart Grid Snapping',
    description: 'Precise placement with intelligent grid snapping and alignment guides.',
  },
  {
    icon: Save,
    title: 'Cloud Projects',
    description: 'Save your designs securely in the cloud and access them from anywhere.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your designs with clients or friends with a single click.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_70%_60%_/_0.05)_0%,transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Everything You Need to
            <span className="gradient-text"> Design</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features that make room design accessible to everyone, 
            from beginners to professional interior designers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 rounded-2xl glass hover-lift cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-heading mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
