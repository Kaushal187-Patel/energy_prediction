import { Card, CardContent } from "../ui/card";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Kaushal",
      role: "Lead Developer",
      expertise: "ML Engineering & Full Stack Development",
      image: "/TeamImage/kaushal.jpg"
    },
    {
      name: "Team Member 2",
      role: "Data Scientist",
      expertise: "Energy Analytics & Predictive Modeling",
      image: "/TeamImage/member2.jpg" // Add your image
    },
    {
      name: "Team Member 3", 
      role: "ML Engineer",
      expertise: "Model Optimization & Deployment",
      image: "/TeamImage/member3.jpg" // Add your image
    },
    {
      name: "Team Member 4",
      role: "Business Analyst",
      expertise: "Energy Domain & Strategy",
      image: "/TeamImage/member4.jpg" // Add your image
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our dedicated team of experts working together to revolutionize energy consumption prediction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-200 group-hover:border-blue-400 transition-colors"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.expertise}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;